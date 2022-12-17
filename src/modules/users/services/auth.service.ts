import { removeCookie } from "src/modules/common/utils/removeCookie";
import { setIsAuthLoading, setUser } from "src/store/auth.reducer";
import store from "src/store/index";
import { AuthApi } from "../api/auth.api";
import { LoginDto } from "../etc/login.dto";
import { RegisterDto } from "../etc/register.dto";

export abstract class AuthService {
  static async login(dto: LoginDto) {
    const res = await AuthApi.login(dto);
    localStorage.setItem("token", res.data.accessToken);
    store.dispatch(setUser(res.data.user));
    return res;
  }
  static async register(dto: RegisterDto) {
    const res = await AuthApi.register(dto);
    localStorage.setItem("token", res.data.accessToken);
    store.dispatch(setUser(res.data.user));
    return res;
  }

  static async logout() {
    return await AuthApi.logout().finally(() => {
      store.dispatch(setUser(null));
      localStorage.removeItem("token");
    });
  }

  static async refresh() {
    const res = await AuthApi.refresh();
    localStorage.setItem("token", res.data.accessToken);
    store.dispatch(setUser(res.data.user));
  }

  static onLoad() {
    if (localStorage.getItem("token") != null) {
      this.refresh()
        .catch(() => {
          localStorage.removeItem("token");
          removeCookie("refreshToken");
        })
        .finally(() => {
          store.dispatch(setIsAuthLoading(false));
        });
    } else {
      store.dispatch(setIsAuthLoading(false));
    }
  }
}
