import { UsersApi } from "src/modules/users/api/users.api";
import { User } from "src/modules/users/models/user.model";
import { UpdateUserDto } from "../dto/update.dto";

export abstract class UserService {
  static async findOne(idOrUsename: string): Promise<User | null> {
    return new User(await UsersApi.findOne(idOrUsename));
  }

  static async update(id: string, dto: UpdateUserDto): Promise<User> {
    return new User(await UsersApi.update(id, dto));
  }
}
