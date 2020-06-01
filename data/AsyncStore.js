import AsyncStorage from '@react-native-community/async-storage';
import store from '../redux/Store';
import {ignoreVent} from '../redux/actions/IgnoreVentilator';
import {disableAlarm} from '../redux/actions/IgnoreAlarm';

const IGNORED_VENTS_KEY = 'IGNORED_VENTS';
const DISABLED_ALARM_KEY = 'DISABLE_ERROR';

export const saveAlertState = async state => {
  const storedValue = JSON.stringify(state);
  await AsyncStorage.setItem(DISABLED_ALARM_KEY, storedValue);
};

export const saveIgnoredVents = async vents => {
  const storedValue = JSON.stringify(vents);
  await AsyncStorage.setItem(IGNORED_VENTS_KEY, storedValue);
};

const restoreIgnored = async () => {
  const values = await AsyncStorage.getItem(IGNORED_VENTS_KEY);
  if (values === null) {
    return;
  }

  const ignored = JSON.parse(values);

  ignored.forEach(vent => store.dispatch(ignoreVent(vent)));
};

const restoreIgnoredAlarms = async () => {
  const values = await AsyncStorage.getItem(DISABLED_ALARM_KEY);

  if (values === null) {
    return;
  }

  const disabled = JSON.parse(values);
  disabled.forEach(vent => store.dispatch(disableAlarm(vent)));
};

restoreIgnored();
restoreIgnoredAlarms();
