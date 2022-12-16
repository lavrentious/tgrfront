import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CreateSpotState = {
  files: string[];
  isCreationFormShown: boolean;
};

const initialState: CreateSpotState = {
  files: [],
  isCreationFormShown: false,
};

const createSpotSlice = createSlice({
  name: "createSpot",
  initialState,
  reducers: {
    removeFile(state, action: PayloadAction<string>) {
      state.files = state.files.filter((url) => url !== action.payload);
    },
    setFiles(state, action: PayloadAction<string[]>) {
      state.files = [...action.payload];
    },
    setIsCreationFormShown(state, action: PayloadAction<boolean>) {
      state.isCreationFormShown = action.payload;
    },
  },
});

export const { removeFile, setFiles, setIsCreationFormShown } =
  createSpotSlice.actions;

export default createSpotSlice.reducer;
