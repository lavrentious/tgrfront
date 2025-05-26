import type { StoredUser } from "src/store/auth.reducer";

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: StoredUser;
}
export const REFRESH_URL = import.meta.env.VITE_API_URL + "/auth/refresh";
