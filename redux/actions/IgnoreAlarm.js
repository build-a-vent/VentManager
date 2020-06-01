export const DISABLE_ALARM = 'DISABLE_ALARM';

export const ENABLE_ALARM = 'ENABLE_ALARM';

export const enableAlarm = payload => ({
  type: ENABLE_ALARM,
  payload,
});

export const disableAlarm = payload => ({
  type: DISABLE_ALARM,
  payload,
});
