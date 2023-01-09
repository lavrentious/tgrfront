import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LatLngTuple } from "leaflet";

type MapState = {
  center: LatLngTuple;
  zoom: number;
  userCoords: LatLngTuple | null;
  isAddressSearchShown: boolean;
};

const initialState: MapState = {
  center: [55.7522, 37.6156],
  zoom: 10,
  userCoords: null,
  isAddressSearchShown: false,
};

const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
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
  },
});

export const { setCenter, setZoom, setUserCoords, setIsAddressSearchShown } =
  mapSlice.actions;

export default mapSlice.reducer;
