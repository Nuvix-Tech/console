import { Models } from "@nuvix/console";
import { create } from "zustand";

interface BucketSelector {
  loading: boolean;
  bucket?: Models.Bucket;
  setBucket: (bucket: Models.Bucket) => void;
  setLoading: (loading: boolean) => void;
  file?: Models.File;
  setFile: (file: Models.File) => void;
}

export const useBucketSelector = create<BucketSelector>((set) => ({
  loading: true,
  bucket: undefined,
  setBucket: (bucket) => set({ bucket }),
  setLoading: (isLoading) => set({ loading: isLoading }),
  setFile(file) {
    set({ file });
  },
}));
