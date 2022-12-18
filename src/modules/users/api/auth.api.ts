import { api } from "src/modules/common/api";
import { StoredUser } from "src/store/auth.reducer";
import { LoginDto } from "../etc/login.dto";
import { RegisterDto } from "../etc/register.dto";

const BASE_URL = "/auth";

export const REFRESH_URL = BASE_URL + "/refresh";

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: StoredUser;
}

export abstract class AuthApi {
  static async login(dto: LoginDto) {
    return await api.post<AuthResponse>(`${BASE_URL}/login`, dto);
  }

  static async register(dto: RegisterDto) {
    return await api.post<AuthResponse>(`${BASE_URL}/register`, dto);
  }

  static async logout() {
    return await api.delete(`${BASE_URL}/logout`);
  }

  static async refresh() {
    return await api.get<AuthResponse>(REFRESH_URL);
  }
}
