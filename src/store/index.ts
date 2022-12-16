import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import authReducer from "./authReducer";
import createSpotReducer from "./createSpotReducer";
import mapReducer from "./mapReducer";

const rootReducer = combineReducers({
  auth: authReducer,
  map: mapReducer,
  createSpot: createSpotReducer,
});

const store = configureStore({
  reducer: rootReducer,
});
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;

export default store;
