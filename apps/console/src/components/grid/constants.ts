export const COLUMN_MIN_WIDTH = 100;

export const STORAGE_KEY_PREFIX = "nuvix_grid";

export const TOTAL_ROWS_INITIAL = -1;
export const TOTAL_ROWS_RESET = -2;

export const SELECT_COLUMN_KEY = "nuvix-grid-select-row";
export const ADD_COLUMN_KEY = "nuvix-grid-add-column";

const RLS_ACKNOWLEDGED_KEY = "nuvix-acknowledge-rls-warning";

export const rlsAcknowledgedKey = (tableID?: string | number) =>
  `${RLS_ACKNOWLEDGED_KEY}-${String(tableID)}`;

export const MAX_CHARACTERS = 1000;
export const MAX_CHARACTERS_WARNING = 1000;

export const MAX_ARRAY_SIZE = 10;
