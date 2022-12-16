import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
  VERIFIED = "VERIFIED",
  MODERATOR = "MODERATOR",
}
export type User = {
  id: string;
  username: string;
  name: string;
  role: string;
};

type AuthState = {
  isLoggedIn: boolean;
  isAuthLoading: boolean;
  user: User | null;
};

const initialState: AuthState = {
  isLoggedIn: false,
  isAuthLoading: true,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    setIsAuthLoading(state, action: PayloadAction<boolean>) {
      state.isAuthLoading = action.payload;
    },
    logout(state) {
      state.user = null;
      state.isLoggedIn = false;
      localStorage.removeItem("token");
    },
  },
});

export const { setUser, logout, setIsAuthLoading } = authSlice.actions;

export default authSlice.reducer;
