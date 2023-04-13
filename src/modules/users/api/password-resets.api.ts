import { api } from "src/modules/common/api";

const BASE_URL = "/password-resets";

export abstract class PasswordResetsApi {
  static async create(usernameOrEmail: string) {
    return (await api.post<null>(BASE_URL, { usernameOrEmail })).data;
  }

  static async check(key: string) {
    return (await api.get<null>(`${BASE_URL}/${key}`)).data;
  }

  static async reset(key: string, password: string) {
    return (await api.patch<null>(`${BASE_URL}/${key}`, { password })).data;
  }
}
