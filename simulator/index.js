const dgram = require('dgram');
const Chance = require('chance');
const chance = new Chance();

const setting = require('./settings');
const server = dgram.createSocket('udp4');
const stack = [];
const vents = Number(process.env.VENTS) || 1;
const simNetworkError = process.env.VENT_ERROR ? true : false;
let errorVent;
const errorTime = Date.now() + 25000; // after 25 seconds vent go in error

if (simNetworkError === true) {
  errorVent = chance.integer({ min: 0, max: vents - 1 });
}

console.log(`--- simulate ${vents} vents -----`);
console.log(
  `--- networkerror is ${simNetworkError === true ? 'ON' : 'OFF'} ---`,
);
const getMac = min => {
  var hexDigits = '0123456789ABCDEF';
  var macAddress = '';
  for (var i = 0; i < 6; i++) {
    macAddress += hexDigits.charAt(Math.round(Math.random() * 15));
    macAddress += hexDigits.charAt(Math.round(Math.random() * 15));
    if (i != 5) {
      macAddress += ':';
    }
  }

  return macAddress;
};

for (var i = 0; i < vents; i++) {
  setting.c_name = `Patient-${i + 1}`;
  setting.mac = getMac(i);
  stack.push(Object.assign({}, setting));
}

server.on('error', err => {
  console.log('Server error => ', err);
  server.close();
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
  const data = JSON.parse(msg);

  switch (data.cmd) {
    case 'scan':
      sendBroadCastAnswer(data.seq, rinfo.address);
      break;
    case 'save':
      save(data, rinfo.address);
  }
});

function save(data, receiver) {
  // 50% of a fail save simulation
  if (chance.bool() === true) {
    console.log('=================== Save ERROR sim =========================');
    return;
  }
  const index = stack.findIndex(entry => {
    return entry.mac === data.mac;
  });

  const fields = Object.keys(stack[index]);
  for (let i = 0; i < fields.length; i++) {
    stack[index][fields[i]] = data[fields[i]];
  }

  stack[index].cmd = 'akk';
  stack[index].seq = data.seq;
  const message = JSON.stringify(stack[index]);

  server.send(message, 0, message.length, 1111, receiver, err => {
    if (err) {
      console.log('error on message send', err);
    }

    console.log('######### AKK SEND #########', message);
  });
}

function sendBroadCastAnswer(seq, receiver) {
  stack.forEach((data, index) => {
    if (errorVent && index === errorVent && Date.now() > errorTime) {
      console.log(`---- Networkerror for ${data.name} ----`);
      return;
    }

    data.seq = seq;
    data.cmd = 'stat';
    const message = JSON.stringify(data);

    server.send(message, 0, message.length, 1111, receiver, err => {
      if (err) {
        console.log('error on message send', err);
      }
    });
  });
}

server.bind(1111);
