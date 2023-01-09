import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LatLngTuple } from "leaflet";
import normalizeLng from "src/modules/common/utils/normalizeLng";
import { PhotoDto } from "src/modules/records/dto/upload-photo.dto";
import { useAppDispatch } from ".";
import store from "./index";

export interface IFile {
  file: { name: string; url: string; size: number };
  dto: PhotoDto;
}

type CreateSpotState = {
  selectedSpot: LatLngTuple | null;
  isSelectingSpot: boolean;
  isFormDisabled: boolean;
  files: IFile[];
  isCreationFormShown: boolean;
};

const initialState: CreateSpotState = {
  selectedSpot: null,
  isSelectingSpot: false,
  isFormDisabled: false,
  files: [],
  isCreationFormShown: false,
};

const createSpotSlice = createSlice({
  name: "createSpot",
  initialState,
  reducers: {
    removeFile(state, action: PayloadAction<string>) {
      state.files = state.files.filter(
        (file) => file.file.url !== action.payload
      );
    },
    setFiles(state, action: PayloadAction<IFile[]>) {
      state.files = [...action.payload];
    },
    updateFileComment(
      state,
      action: PayloadAction<{ url: IFile["file"]["url"]; value: string }>
    ) {
      const file = state.files.find((f) => f.file.url === action.payload.url);
      if (file) file.dto.comment = action.payload.value;
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
  setFiles,
  setIsCreationFormShown,
  pickSpot,
  setIsSelectingSpot,
  setSelectedSpot,
  setIsFormDisabled,
  updateFileComment,
} = createSpotSlice.actions;

export const deleteFile = (
  url: string,
  dispatch: ReturnType<typeof useAppDispatch>
) => {
  dispatch(removeFile(url));
  URL.revokeObjectURL(url);
};
export function resetForm(dispatch: ReturnType<typeof useAppDispatch>) {
  dispatch(setSelectedSpot(null));
  for (const url in store.getState().createSpot.files) {
    dispatch(setFiles([]));
    URL.revokeObjectURL(url);
  }
}

export default createSpotSlice.reducer;
