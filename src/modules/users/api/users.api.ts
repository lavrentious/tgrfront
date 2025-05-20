import { api } from "src/modules/common/api";
import { PaginateParams } from "src/modules/common/dto/paginate-params.dto";
import type { PaginateResult } from "src/modules/common/dto/paginate-result.dto";
import { User } from "src/modules/users/models/user.model";
import type { UpdatePasswordDto } from "../dto/update-password.dto";
import type { UpdateUserDto } from "../dto/update.dto";

const BASE_URL = "/users";

export class FindAllUsersParams extends PaginateParams {
  search?: string;
}

export abstract class UsersApi {
  static async findOne(idOrUsername: string) {
    return (await api.get<User>(`${BASE_URL}/${idOrUsername}`)).data;
  }

  static async findAll(params?: FindAllUsersParams) {
    return (await api.get<PaginateResult<User>>(`${BASE_URL}`, { params }))
      .data;
  }

  static async update(id: string, dto: UpdateUserDto): Promise<User> {
    return (await api.patch<User>(`${BASE_URL}/${id}`, dto)).data;
  }

  static async updatePassword(
    id: string,
    dto: UpdatePasswordDto,
  ): Promise<void> {
    return (await api.put<void>(`${BASE_URL}/${id}/password`, dto)).data;
  }

  static async resendEmail(): Promise<void> {
    return (await api.post<void>(`${BASE_URL}/confirm-email`)).data;
  }
}
