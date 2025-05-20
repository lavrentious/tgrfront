import {
  type Action,
  combineReducers,
  configureStore,
  type ThunkAction,
} from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import authReducer from "./auth.reducer";
import createSpotReducer from "./createSpot.reducer";
import mapReducer from "./map.reducer";

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
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export default store;
