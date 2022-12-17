import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
  VERIFIED = "VERIFIED",
  MODERATOR = "MODERATOR",
}
export type StoredUser = {
  id: string;
  username?: string;
  name?: string;
  role: string;
};

type AuthState = {
  isAuthLoading: boolean;
  user: StoredUser | null;
};

const initialState: AuthState = {
  isAuthLoading: true,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<StoredUser | null>) {
      state.user = action.payload;
    },
    setIsAuthLoading(state, action: PayloadAction<boolean>) {
      state.isAuthLoading = action.payload;
    },
  },
});

export const { setUser, setIsAuthLoading } = authSlice.actions;

export default authSlice.reducer;
