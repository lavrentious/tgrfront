import { AxiosError } from "axios";
import { setIsAuthLoading, setUser } from "src/store/auth.reducer";
import store from "src/store/index";
import { AuthApi } from "../api/auth.api";
import { LoginDto } from "../dto/login.dto";
import { RegisterDto } from "../dto/register.dto";

export abstract class AuthService {
  static async login(dto: LoginDto) {
    const res = await AuthApi.login(dto);
    TokenService.accessToken = res.data.accessToken;
    store.dispatch(setUser(res.data.user));
    return res;
  }
  static async register(dto: RegisterDto) {
    const res = await AuthApi.register(dto);
    TokenService.accessToken = res.data.accessToken;
    store.dispatch(setUser(res.data.user));
    return res;
  }

  static async logout() {
    store.dispatch(setUser(null));
    TokenService.clearTokens();
    return AuthApi.logout();
  }

  static async refresh() {
    return AuthApi.refresh()
      .then((res) => {
        TokenService.accessToken = res.data.accessToken;
        store.dispatch(setUser(res.data.user));
      })
      .catch((e: AxiosError) => {
        store.dispatch(setUser(null));
        if (e.response?.status === 401) {
          TokenService.clearTokens();
        }
        throw e;
      });
  }

  static onLoad() {
    if (TokenService.accessToken) {
      store.dispatch(setIsAuthLoading(true));
      this.refresh().finally(() => {
        store.dispatch(setIsAuthLoading(false));
      });
    } else {
      store.dispatch(setIsAuthLoading(false));
    }
  }
}

export const REFRESH_TOKEN_NAME = "refreshToken";
export const ACCESS_TOKEN_NAME = "token";

export abstract class TokenService {
  static clearTokens() {
    this.accessToken = null;
    if (store.getState().auth.user != null) store.dispatch(setUser(null));
  }

  static set accessToken(token: string | null) {
    if (token) localStorage.setItem(ACCESS_TOKEN_NAME, token);
    else localStorage.removeItem(ACCESS_TOKEN_NAME);
  }

  static get accessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_NAME);
  }
}
