import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Role } from "src/modules/users/models/user.model";
import { TokenService } from "src/modules/users/services/token.service";

export type StoredUser = {
  id: string;
  username?: string;
  name?: string;
  role: Role;
};

type AuthState = {
  isAuthLoading: boolean;
  user: StoredUser | null;
};

const initialState: AuthState = {
  isAuthLoading: !!TokenService.accessToken,
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
