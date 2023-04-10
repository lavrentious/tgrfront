import { api } from "src/modules/common/api";
import { User } from "src/modules/users/models/user.model";

const BASE_URL = "/users";

export abstract class UsersApi {
  static async findOne(idOrUsername: string) {
    return (await api.get<User>(`${BASE_URL}/${idOrUsername}`)).data;
  }
}
