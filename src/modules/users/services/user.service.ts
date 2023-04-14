import { updatedDiff } from "deep-object-diff";
import { UsersApi } from "src/modules/users/api/users.api";
import { User } from "src/modules/users/models/user.model";
import { UpdateUserDto } from "../dto/update.dto";

export abstract class UserService {
  static async findOne(idOrUsename: string): Promise<User | null> {
    return new User(await UsersApi.findOne(idOrUsename));
  }

  static async update(
    id: string,
    dto: UpdateUserDto,
    user?: User
  ): Promise<User> {
    if (user) {
      dto = updatedDiff(user, { ...user, ...dto });
    }
    if (Object.keys(dto).length === 0) {
      if (user) return user;
      throw new Error("no changes");
    }
    return new User(await UsersApi.update(id, dto));
  }
}
