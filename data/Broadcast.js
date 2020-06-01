import {NetworkInfo} from 'react-native-network-info';
import store from '../redux/Store';
import {insertVentilatorByBroadcast} from '../redux/actions/InsertVentilator';
import {savingToggle} from '../redux/actions/Saving';
import {keepAlive} from '../redux/actions/KeepAlive';
import {errorRemove, errorAdd} from '../redux/actions/Errors';

const Buffer = (global.Buffer = global.Buffer || require('buffer').Buffer);
const dgram = require('dgram');

const socketType = 'udp4';
const socketPort = 1111;

const SCAN_CMD = 'scan';
const SAVE_CMD = 'save';
const AKK_CMD = 'akk';

const retryTime = 100;
const broadcastInterval = 3000; // seconds to milLiseconds

const errorMessage = 'Check your Wifi';

let saveStack = {};

class Broadcaster {
  ip;
  subnet;
  broadcast;
  seqPrefix;
  socket;
  sequense = 0;

  constructor() {
    this.socket = dgram.createSocket(socketType);
    this.getInterfaceIp().getInterfaceNet();
  }

  init() {
    this.calculateBroadcast();
    this.socket.once('listening', () => {
      this.sendBroadcast();
    });

    this.socket.on('message', this.receive.bind(this));
    this.socket.bind(socketPort);
  }

  receive(msg, rinfo) {
    const data = JSON.parse(msg.toString());
    const cmd = data.cmd.toLowerCase();
    if (cmd === SCAN_CMD) {
      return;
    }

    if (cmd === AKK_CMD) {
      saveStack = {};
      store.dispatch(savingToggle(false));
    }

    data.ip = rinfo.address;
    delete data.req;

    store.dispatch(insertVentilatorByBroadcast(data));
    store.dispatch(keepAlive({[data.mac]: Date.now()}));
  }

  getInterfaceIp() {
    NetworkInfo.getIPV4Address().then(ipv4Address => {
      this.ip = ipv4Address;

      if (this.broadcast) {
        this.init();
      }
    });
    return this;
  }

  stringToBuffer(data) {
    return Buffer.from(data);
  }

  verifySuccesSend(seq) {
    if (saveStack[seq]) {
      this.saveSettingsToVent(saveStack[seq]);
    }
  }

  saveSettingsToVent(data) {
    let sendData;
    if (!data.seq) {
      sendData = {
        ...data,
        cmd: SAVE_CMD,
        seq: parseInt(`${this.seqPrefix}${this.sequense}`, 10),
      };
      saveStack[sendData.seq] = sendData;
    } else {
      sendData = data;
    }

    const buffer = this.stringToBuffer(JSON.stringify(sendData));

    this.socket.send(buffer, 0, buffer.length, socketPort, data.ip, err => {
      if (err) {
        this.reportError();
      } else {
        this.resolveError();
      }

      setTimeout(() => this.verifySuccesSend(sendData.seq), retryTime);
    });

    ++this.sequense;
  }

  /**
   * sends the broadcast for all ventilators no specials needed
   */
  sendBroadcast() {
    const buffer = this.stringToBuffer(
      JSON.stringify({
        cmd: SCAN_CMD,
        seq: parseInt(`${this.seqPrefix}${this.sequense}`, 10),
      }),
    );
    ++this.sequense;
    store.dispatch(keepAlive({system: Date.now()}));
    this.socket.send(
      buffer,
      0,
      buffer.length,
      socketPort,
      this.broadcast,
      err => {
        if (err) {
          this.reportError();
        } else {
          this.resolveError();
        }
        this.timeout = setTimeout(
          () => this.sendBroadcast(),
          broadcastInterval,
        );
      },
    );
  }

  resolveError() {
    store.dispatch(errorRemove('network'));
  }

  reportError() {
    store.dispatch(errorAdd({network: errorMessage}));
  }

  getInterfaceNet() {
    NetworkInfo.getSubnet().then(subnet => {
      this.subnet = subnet;
      if (this.ip) {
        this.init();
      }
    });
    return this;
  }

  calculateBroadcast() {
    const addr_splitted = this.ip.split('.');
    const netmask_splitted = this.subnet.split('.');
    this.seqPrefix = addr_splitted.slice(-1)[0]; //last part of a ip is unique so we can use as prefix

    // bitwise OR over the splitted NAND netmask, then glue them back together with a dot character to form an ip
    // we have to do a NAND operation because of the 2-complements; getting rid of all the 'prepended' 1's with & 0xFF
    this.broadcast = addr_splitted
      // eslint-disable-next-line no-bitwise
      .map((e, i) => (~netmask_splitted[i] & 0xff) | e)
      .join('.');

    return this;
  }
}

const broadcast = new Broadcaster();

export default broadcast;
