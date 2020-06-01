export const DO_NOT_IGNORE_VENT = 'DO_NOT_IGNORE_VENT';
export const IGNORE_VENT = 'IGNORE_VENT';

export const removeIgnoreVent = payload => ({
  type: DO_NOT_IGNORE_VENT,
  payload,
});

export const ignoreVent = payload => ({
  type: IGNORE_VENT,
  payload,
});
