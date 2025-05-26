import store from "src/store";
import { setIsAuthLoading, setUser } from "src/store/auth.reducer";
import { authApi } from "../api/auth.api";
import { TokenService } from "./token.service";

export const AuthService = {
  async refresh() {
    const result = await store.dispatch(authApi.endpoints.refresh.initiate());
    if (result.data) {
      TokenService.accessToken = result.data.accessToken;
      store.dispatch(setUser(result.data.user));
    } else {
      TokenService.clear();
      store.dispatch(setUser(null));
    }
  },
  onLoad() {
    if (TokenService.accessToken) {
      store.dispatch(setIsAuthLoading(true));
      this.refresh().finally(() => store.dispatch(setIsAuthLoading(false)));
    } else {
      store.dispatch(setIsAuthLoading(false));
    }
  },
};
