import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LatLngTuple } from "leaflet";
import normalizeLng from "src/modules/common/utils/normalizeLng";

type MapState = {
  selectedSpot: LatLngTuple | null;
  isSelectingSpot: boolean;
  center: LatLngTuple;
  zoom: number;
  userCoords: LatLngTuple | null;
  isAddressSearchShown: boolean;
};

const initialState: MapState = {
  selectedSpot: null,
  isSelectingSpot: false,
  center: [55.7522, 37.6156],
  zoom: 10,
  userCoords: null,
  isAddressSearchShown: false,
};

const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setSelectedSpot(state, action: PayloadAction<LatLngTuple | null>) {
      if (action.payload) {
        const [lat, lng] = action.payload;
        state.selectedSpot = [lat, normalizeLng(lng)];
      } else state.selectedSpot = action.payload;
    },
    setIsSelectingSpot(state, action: PayloadAction<boolean>) {
      state.isSelectingSpot = action.payload;
    },
    setCenter(state, action: PayloadAction<LatLngTuple>) {
      state.center = action.payload;
    },
    setZoom(state, action: PayloadAction<number>) {
      state.zoom = action.payload;
    },
    setUserCoords(state, action: PayloadAction<LatLngTuple | null>) {
      state.userCoords = action.payload;
    },
    setIsAddressSearchShown(state, action: PayloadAction<boolean>) {
      state.isAddressSearchShown = action.payload;
    },
    pickSpot(state, action: PayloadAction<LatLngTuple>) {
      state.selectedSpot = action.payload;
      state.center = action.payload;
      state.isSelectingSpot = false;
      state.isAddressSearchShown = false;
    },
  },
});

export const {
  setSelectedSpot,
  setIsSelectingSpot,
  setCenter,
  setZoom,
  setUserCoords,
  setIsAddressSearchShown,
  pickSpot,
} = mapSlice.actions;

export default mapSlice.reducer;
