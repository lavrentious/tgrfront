import { api } from "src/modules/common/api";
import { User } from "src/modules/users/models/user.model";
import { UpdatePasswordDto } from "../dto/update-password.dto";
import { UpdateUserDto } from "../dto/update.dto";

const BASE_URL = "/users";

export abstract class UsersApi {
  static async findOne(idOrUsername: string) {
    return (await api.get<User>(`${BASE_URL}/${idOrUsername}`)).data;
  }

  static async update(id: string, dto: UpdateUserDto): Promise<User> {
    return (await api.patch<User>(`${BASE_URL}/${id}`, dto)).data;
  }

  static async updatePassword(
    id: string,
    dto: UpdatePasswordDto
  ): Promise<void> {
    return (await api.put<void>(`${BASE_URL}/${id}/password`, dto)).data;
  }
}
