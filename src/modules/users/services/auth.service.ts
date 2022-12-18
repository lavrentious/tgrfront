import { cookieExists } from "src/modules/common/utils/cookieExists";
import { setIsAuthLoading, setUser } from "src/store/auth.reducer";
import store from "src/store/index";
import { AuthApi } from "../api/auth.api";
import { LoginDto } from "../etc/login.dto";
import { RegisterDto } from "../etc/register.dto";
import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME, TokenService } from "./token.service";

export abstract class AuthService {
  static async login(dto: LoginDto) {
    const res = await AuthApi.login(dto);
    localStorage.setItem(ACCESS_TOKEN_NAME, res.data.accessToken);
    store.dispatch(setUser(res.data.user));
    return res;
  }
  static async register(dto: RegisterDto) {
    const res = await AuthApi.register(dto);
    localStorage.setItem(ACCESS_TOKEN_NAME, res.data.accessToken);
    store.dispatch(setUser(res.data.user));
    return res;
  }

  static async logout() {
    return await AuthApi.logout().finally(() => {
      store.dispatch(setUser(null));
      localStorage.removeItem(ACCESS_TOKEN_NAME);
    });
  }

  static async refresh() {
    const res = await AuthApi.refresh();
    localStorage.setItem(ACCESS_TOKEN_NAME, res.data.accessToken);
    store.dispatch(setUser(res.data.user));
  }

  static onLoad() {
    if (cookieExists(REFRESH_TOKEN_NAME)) {
      this.refresh()
        .catch(() => {
          TokenService.clearTokens();
        })
        .finally(() => {
          store.dispatch(setIsAuthLoading(false));
        });
    } else {
      store.dispatch(setIsAuthLoading(false));
    }
  }
}
