export const CONFIRM_WARNINGS = 'CONFIRM_WARNINGS';
export const CLEAR_CONFIRMES = 'CLEAR_CONFIRMED';

export const confirmWarnings = payload => ({
  type: CONFIRM_WARNINGS,
  payload,
});

export const clearConfirmed = () => ({
  type: CLEAR_CONFIRMES,
});
