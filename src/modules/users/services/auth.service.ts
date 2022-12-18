import { setIsAuthLoading, setUser } from "src/store/auth.reducer";
import store from "src/store/index";
import { AuthApi } from "../api/auth.api";
import { LoginDto } from "../dto/login.dto";
import { RegisterDto } from "../dto/register.dto";
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
    store.dispatch(setUser(null));
    TokenService.clearTokens();
    return AuthApi.logout();
  }

  static async refresh() {
    const res = await AuthApi.refresh();
    TokenService.accessToken = res.data.accessToken;
    store.dispatch(setUser(res.data.user));
  }

  static onLoad() {
    if (TokenService.accessToken) {
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
