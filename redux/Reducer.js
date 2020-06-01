import {TAB_SWITCH} from './actions/Tab';
import {ACTIVE_VENTILATOR} from './actions/ActiveVentilator';
import {TOGGLE_LIST_MODAL} from './actions/ToogleListModal';
import {UPDATE_VENTILATOR} from './actions/UpdateVentilator';
import {SAVE_VENTILATOR} from './actions/SaveVentilator';
import {ACTIVE_LIST} from '../constants/TabName';
import {TOGGLE_BURGER_MENU} from './actions/Menu';
import {INSERT_VENTILATOR_BY_BROADCAST} from './actions/InsertVentilator';
import {EDIT_VENTILATOR} from './actions/EditVentilator';

import {SAVING_TOGGLE} from './actions/Saving';
import {DO_NOT_IGNORE_VENT, IGNORE_VENT} from './actions/IgnoreVentilator';
import {DISABLE_ALARM, ENABLE_ALARM} from './actions/IgnoreAlarm';
import {KEEP_ALIVE} from './actions/KeepAlive';
import {ERROR_ADD, ERROR_REMOVE} from './actions/Errors';
import {CONFIRM_WARNINGS, CLEAR_CONFIRMES} from './actions/ConfirmWaring';

import broadcast from '../data/Broadcast';
import '../data/Tasks';
import {saveIgnoredVents, saveAlertState} from '../data/AsyncStore';

const OUTDATED_TIME = 2 * 60 * 1000; // 5 Mins
const initialState = {
  warnings: [],
  errors: {}, // system error like disabled wifi
  confirmed: {},
  ignoreAlarms: [],
  ignoreVentilator: [],
  keepAlive: {},
  ventilators: [],
  activeTab: ACTIVE_LIST,
  activeVentilator: null,
  editVentilator: null,
  ventilatorModal: undefined,
  saveing: false,
};

const reducer = (state = initialState, action) => {
  const type = action.type;
  const payload = action.payload;
  let arrayIndex;

  //if (type !== INSERT_VENTILATOR_BY_BROADCAST) {
  //  console.log(action, payload);
  //}

  switch (type) {
    case CLEAR_CONFIRMES:
      let outdated = Date.now() - OUTDATED_TIME;
      for (var key in state.confirmed) {
        if (state.confirmed[key].confirmed < outdated) {
          delete state.confirmed[key];
        }
      }
      return {
        ...state,
        confirmed: {...state.confirmed},
      };

    case CONFIRM_WARNINGS:
      return {
        ...state,
        confirmed: {
          ...state.confirmed,
          ...{
            [payload.mac]: {
              type: payload.type,
              isWarning: payload.isWarning,
              confirmed: Date.now(),
            },
          },
        },
      };
    case ERROR_ADD:
      return {
        ...state,
        errors: {...state.errors, ...payload},
      };

    case ERROR_REMOVE:
      let errors = {...state.errors};
      delete errors[payload];
      return {
        ...state,
        errors,
      };

    case KEEP_ALIVE:
      return {
        ...state,
        keepAlive: {...state.keepAlive, ...payload},
      };
    case ENABLE_ALARM:
      var ignoreAlarms = [...state.ignoreAlarms];
      arrayIndex = ignoreAlarms.indexOf(payload);
      if (arrayIndex !== -1) {
        ignoreAlarms.splice(arrayIndex, 1);
      }

      saveAlertState(ignoreAlarms);
      return {
        ...state,
        ignoreAlarms: [...ignoreAlarms],
      };
    case DISABLE_ALARM:
      var ignoreAlarms = [...state.ignoreAlarms];
      arrayIndex = ignoreAlarms.indexOf(payload);

      if (arrayIndex === -1) {
        ignoreAlarms.push(payload);
      }

      saveAlertState(ignoreAlarms);
      return {
        ...state,
        ignoreAlarms: [...ignoreAlarms],
      };

    case IGNORE_VENT:
      var ignoreVentilator = [...state.ignoreVentilator];
      arrayIndex = ignoreVentilator.indexOf(payload);

      if (arrayIndex === -1) {
        ignoreVentilator.push(payload);
      }

      saveIgnoredVents(ignoreVentilator);
      return {
        ...state,
        ignoreVentilator: [...ignoreVentilator],
      };

    case DO_NOT_IGNORE_VENT:
      var ignoreVentilator = [...state.ignoreVentilator];
      arrayIndex = ignoreVentilator.indexOf(payload);

      if (arrayIndex !== -1) {
        ignoreVentilator.splice(arrayIndex, 1);
      }
      saveIgnoredVents(ignoreVentilator);
      return {
        ...state,
        ignoreVentilator,
      };

    case SAVING_TOGGLE:
      console.log('saving payload ==>', payload);
      return {
        ...state,
        saveing: payload,
      };

    case TOGGLE_BURGER_MENU:
      return {
        ...state,
        burgerOpen: !state.burgerOpen,
      };
    case TAB_SWITCH:
      return {
        ...state,
        activeTab: payload,
      };

    case TOGGLE_LIST_MODAL:
      return {
        ...state,
        ventilatorModal: payload,
        editVentilator: null,
      };

    case ACTIVE_VENTILATOR:
      console.log('active vents');
      return {
        ...state,
        activeVentilator: payload,
      };

    case UPDATE_VENTILATOR:
      return {
        ...state,
        editVentilator: {
          ...state.editVentilator,
          ...payload,
        },
      };

    case SAVE_VENTILATOR:
      arrayIndex = state.ventilators.findIndex(
        data => data.mac === state.editVentilator.mac,
      );
      state.ventilators.splice(arrayIndex, 1, state.editVentilator);

      broadcast.saveSettingsToVent(state.editVentilator);
      return {
        ...state,
        saveing: true,
        editVentilator: {...state.editVentilator},
        ventilators: [...state.ventilators],
      };

    case INSERT_VENTILATOR_BY_BROADCAST:
      const ventilators = [...state.ventilators];
      arrayIndex = state.ventilators.findIndex(
        data => data.mac === payload.mac,
      );
      delete payload.seq;
      delete payload.cmd;

      const update = Object.assign({}, ventilators[arrayIndex], payload);

      if (arrayIndex === -1) {
        ventilators.push(update);
      } else {
        ventilators.splice(arrayIndex, 1, update);
      }

      return {
        ...state,
        ventilators,
      };

    case EDIT_VENTILATOR:
      return {
        ...state,
        editVentilator: {
          ...state.ventilators.find(data => data.mac === payload),
        },
      };

    default:
      console.log(`---- cant find action ${type} in reducer ----`);
      return state;
  }
};

export default reducer;
