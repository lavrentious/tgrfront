import { UsersApi } from "src/modules/users/api/users.api";
import { User } from "src/modules/users/models/user.model";

export abstract class UserService {
  static async findOne(idOrUsename: string): Promise<User | null> {
    return UsersApi.findOne(idOrUsename);
  }
}
