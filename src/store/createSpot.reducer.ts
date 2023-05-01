import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LatLngTuple } from "leaflet";
import { NormalizedObjects } from "src/modules/common/types";
import arrayMove from "src/modules/common/utils/arrayMove";
import normalizeLng from "src/modules/common/utils/normalizeLng";
import { IFile } from "src/modules/records/records.types";
import { AppThunk } from ".";

export interface CreateSpotState {
  selectedSpot: LatLngTuple | null;
  isSelectingSpot: boolean;
  isFormDisabled: boolean;
  files: NormalizedObjects<IFile>;
  isCreationFormShown: boolean;
}

const initialState: CreateSpotState = {
  selectedSpot: null,
  isSelectingSpot: false,
  isFormDisabled: false,
  files: {
    byId: {},
    allIds: [],
  },
  isCreationFormShown: false,
};

const createSpotSlice = createSlice({
  name: "createSpot",
  initialState,
  reducers: {
    removeFile(state, action: PayloadAction<string>) {
      state.files.allIds = state.files.allIds.filter(
        (id) => id !== action.payload
      );
      delete state.files.byId[action.payload];
    },
    clearFiles(state) {
      state.files.byId = {};
      state.files.allIds = [];
    },
    addFile(state, action: PayloadAction<IFile>) {
      state.files.allIds = [...state.files.allIds, action.payload.file.url];
      state.files.byId[action.payload.file.url] = action.payload;
    },
    setFiles(state, action: PayloadAction<string[]>) {
      state.files.allIds = [...action.payload];
    },
    updateFile(state, action: PayloadAction<{ url: string; value: IFile }>) {
      if (state.files.byId[action.payload.url])
        state.files.byId[action.payload.url] = { ...action.payload.value };
    },
    setIsCreationFormShown(state, action: PayloadAction<boolean>) {
      state.isCreationFormShown = action.payload;
    },
    setSelectedSpot(state, action: PayloadAction<LatLngTuple | null>) {
      if (action.payload) {
        const [lat, lng] = action.payload;
        state.selectedSpot = [lat, normalizeLng(lng)];
      } else state.selectedSpot = action.payload;
    },
    setIsSelectingSpot(state, action: PayloadAction<boolean>) {
      state.isSelectingSpot = action.payload;
    },
    pickSpot(state, action: PayloadAction<LatLngTuple>) {
      state.selectedSpot = action.payload;
      state.isSelectingSpot = false;
    },
    setIsFormDisabled(state, action: PayloadAction<boolean>) {
      state.isFormDisabled = action.payload;
    },
  },
});

export const {
  removeFile,
  addFile,
  clearFiles,
  setIsCreationFormShown,
  pickSpot,
  setIsSelectingSpot,
  setSelectedSpot,
  setIsFormDisabled,
  updateFile,
  setFiles,
} = createSpotSlice.actions;

export const moveFile =
  (fromIndex: number, toIndex: number): AppThunk =>
  (dispatch, getState) => {
    const files = getState().createSpot.files;
    const newOrder = arrayMove(files.allIds, fromIndex, toIndex);
    dispatch(setFiles(newOrder));
  };
export const deleteFile =
  (url: string): AppThunk =>
  (dispatch) => {
    dispatch(removeFile(url));
    URL.revokeObjectURL(url);
  };
export const resetForm = (): AppThunk => (dispatch, getState) => {
  dispatch(setSelectedSpot(null));
  const fileUrls = getState().createSpot.files.allIds;
  fileUrls.forEach((url) => {
    URL.revokeObjectURL(url);
  });
  dispatch(clearFiles());
};

export default createSpotSlice.reducer;
