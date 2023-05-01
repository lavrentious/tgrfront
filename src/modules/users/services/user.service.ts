import { diff } from "deep-object-diff";
import { PaginateResult } from "src/modules/common/dto/paginate-result.dto";
import { FindAllUsersParams, UsersApi } from "src/modules/users/api/users.api";
import { User } from "src/modules/users/models/user.model";
import { UpdatePasswordDto } from "../dto/update-password.dto";
import { UpdateUserDto } from "../dto/update.dto";

export abstract class UserService {
  static async findOne(idOrUsename: string): Promise<User | null> {
    return new User(await UsersApi.findOne(idOrUsename));
  }

  static async findAll(
    params?: FindAllUsersParams
  ): Promise<PaginateResult<User>> {
    const res = await UsersApi.findAll(params);
    return { ...res, docs: res.docs.map((d) => new User(d)) };
  }

  static async update(
    id: string,
    dto: UpdateUserDto,
    user?: User
  ): Promise<User> {
    if (user) {
      dto = diff(user, { ...user, ...dto });
    }
    if (Object.keys(dto).length === 0) {
      if (user) return user;
      throw new Error("no changes");
    }
    return new User(await UsersApi.update(id, dto));
  }

  static async updatePassword(
    id: string,
    dto: UpdatePasswordDto
  ): Promise<void> {
    return UsersApi.updatePassword(id, dto);
  }

  static async resendEmail(): Promise<void> {
    return UsersApi.resendEmail();
  }
}
