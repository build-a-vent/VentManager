const CLEAR_TASK = 10000;
import store from '../redux/Store';
import {clearConfirmed} from '../redux/actions/ConfirmWaring';

setInterval(() => {
  store.dispatch(clearConfirmed());
}, CLEAR_TASK);
