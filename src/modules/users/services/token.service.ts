import { setUser } from "src/store/auth.reducer";
import store from "src/store/index";

export const REFRESH_TOKEN_NAME = "refreshToken";
export const ACCESS_TOKEN_NAME = "token";

export abstract class TokenService {
  static clearTokens() {
    this.accessToken = null;
    store.dispatch(setUser(null));
  }

  static set accessToken(token: string | null) {
    if (token) localStorage.setItem(ACCESS_TOKEN_NAME, token);
    else localStorage.removeItem(ACCESS_TOKEN_NAME);
  }

  static get accessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_NAME);
  }
}
