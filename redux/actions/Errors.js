export const ERROR_ADD = 'ERROR_ADD';
export const ERROR_REMOVE = 'ERROR_REMOVE';

export const errorAdd = payload => ({
  type: ERROR_ADD,
  payload,
});

export const errorRemove = payload => ({
  type: ERROR_REMOVE,
  payload,
});
