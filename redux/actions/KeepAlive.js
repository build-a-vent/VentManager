export const KEEP_ALIVE = 'KEEP_ALIVE';

export const keepAlive = payload => ({
  type: KEEP_ALIVE,
  payload,
});
