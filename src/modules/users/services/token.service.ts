import { removeCookie } from "src/modules/common/utils/removeCookie";
import { setUser } from "src/store/auth.reducer";
import store from "src/store/index";

export const REFRESH_TOKEN_NAME = "refreshToken";
export const ACCESS_TOKEN_NAME = "token";

export abstract class TokenService {
  static clearTokens() {
    localStorage.removeItem(ACCESS_TOKEN_NAME);
    removeCookie(REFRESH_TOKEN_NAME);
    store.dispatch(setUser(null));
  }
}
