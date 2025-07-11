import { proxy, useSnapshot } from "valtio";

export const createTableEditorState = () => {
  const state = proxy({
    sql: "",
    setSql: (_sql?: string) => {
      state.sql = _sql ?? "";
    },
    loading: false,
    setLoading: (v: boolean) => (state.loading = v),
    results: undefined,
  });

  return state;
};

const useSqlEditorState = createTableEditorState();

export const useSqlEditorStateSnapshot = (options?: Parameters<typeof useSnapshot>[1]) => {
  return useSnapshot(useSqlEditorState, options);
};
