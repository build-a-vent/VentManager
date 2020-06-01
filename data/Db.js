import Datastore from 'react-native-local-mongodb';
import AsyncStorage from '@react-native-community/async-storage';
import store from '../redux/Store';
import {insertVentilatorByBroadcast} from '../redux/actions/InsertVentilator';
import broadcast, {BROADCASTER_TYPE} from './Broadcast';
import {updateWarning} from '../redux/actions/Warnings';
import {config} from '../constants/VentilatorData';

const db = new Datastore({
  filename: 'buildavent',
  storage: AsyncStorage,
});

const stayAlive = () => {
  db.find(
    {lastupdate: {$lt: Date.now() - 5000}, alert: true, isConfirmed: false},
    (err, docs) => {
      if (err) {
        throw err;
      }

      store.dispatch(updateWarning(docs));
      db.update(
        {type: 'alertQue'},
        {$set: {lastLook: Date.now()}},
        {multi: true},
        (error, count) => {
          if (error) {
            throw err;
          }
        },
      );
    },
  );
};

export const updateConfirmState = mac => {
  db.update({alertMac: mac}, {$set: {isConfirmed: true}}, function(err) {
    if (err) {
      throw err;
    }
  });

  db.update({mac: mac}, {$set: {isConfirmed: true}}, function(err) {
    if (err) {
      throw err;
    }
  });
};

export const loadDatabase = () => {
  db.loadDatabase(err => {
    if (err) {
      throw err;
    }

    db.remove({}, {multi: true}, function(err, numRemoved) {
      console.log(err);
      console.log(`Remove ${numRemoved} docs`);
    });

    db.find({deviceType: BROADCASTER_TYPE}, (error, docs) => {
      if (error) {
        throw error;
      }

      for (let i = 0; i < docs.length; i++) {
        store.dispatch(insertVentilatorByBroadcast(docs[i]));
      }

      setInterval(stayAlive, 5000);
    });
  });
};

export const updateByStore = data => {
  db.update({_id: data._id}, data, {}, (err, numReplaced) => {
    if (err) {
      throw err;
    }
  });
};

export const updateVentilator = data => {
  db.find({mac: data.mac}, (error, docs) => {
    if (error) {
      throw error;
    }

    if (docs.length) {
      data.hide = docs[0].hide;
      data._id = docs[0]._id;
      data.alert = docs[0].alert;
      //todo: --- ONLY FOR SIM -----
      data[config[1].data] = docs[0][config[1].data];
      data[config[2].data] = docs[0][config[2].data];
      data[config[3].data] = docs[0][config[3].data];
      data[config[4].data] = docs[0][config[4].data];
    } else {
      //todo: --- ONLY FOR SIM -----
      data[config[1].data] = config[1].default;
      data[config[2].data] = config[2].default;
      data[config[3].data] = config[3].default;
      data[config[4].data] = config[4].default;
    }

    db.update(
      {alertMac: data.mac},
      {
        lastupdate: Date.now(),
        alertMac: data.mac,
        alertName: data.name,
        isConfirmed: false,
        alert: data.alert,
        type: 'alertQue',
        lastLook: '',
      },
      {upsert: true},
      aliveErr => {
        if (aliveErr) {
          throw aliveErr;
        }
      },
    );

    db.update(
      {_id: data._id},
      data,
      {upsert: true},
      (err, numReplaced, upsert) => {
        if (err) {
          throw err;
        }

        if (upsert) {
          store.dispatch(insertVentilatorByBroadcast(upsert));
          return;
        }
        store.dispatch(insertVentilatorByBroadcast(data));
      },
    );
  });
};

export default db;
