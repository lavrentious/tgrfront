import {
  type Action,
  combineReducers,
  configureStore,
  type ThunkAction,
} from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { api } from "../api/api";
import authReducer from "./auth.reducer";
import createSpotReducer from "./createSpot.reducer";
import mapReducer from "./map.reducer";

const rootReducer = combineReducers({
  auth: authReducer,
  map: mapReducer,
  createSpot: createSpotReducer,
  [api.reducerPath]: api.reducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
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
