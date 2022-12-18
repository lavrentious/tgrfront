import { setIsAuthLoading, setUser } from "src/store/auth.reducer";
import store from "src/store/index";
import { AuthApi } from "../api/auth.api";
import { LoginDto } from "../etc/login.dto";
import { RegisterDto } from "../etc/register.dto";
import { TokenService } from "./token.service";

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
    return await AuthApi.logout().finally(() => {
      store.dispatch(setUser(null));
      TokenService.accessToken = null;
    });
  }

  static async refresh() {
    const res = await AuthApi.refresh();
    TokenService.accessToken = res.data.accessToken;
    store.dispatch(setUser(res.data.user));
  }

  static onLoad() {
    if (TokenService.refreshToken) {
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
