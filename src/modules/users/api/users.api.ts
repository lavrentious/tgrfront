import { api } from "src/api/api";
import { PaginateParams } from "src/modules/common/dto/paginate-params.dto";
import type { PaginateResult } from "src/modules/common/dto/paginate-result.dto";
import type { IUser } from "src/modules/users/models/user.model";
import type { UpdatePasswordDto } from "../dto/update-password.dto";
import type { UpdateUserDto } from "../dto/update.dto";

export interface FindAllUsersParams extends PaginateParams {
  search?: string;
}

export const usersApi = api.injectEndpoints({
  endpoints: (build) => ({
    getUser: build.query<IUser, string>({
      query: (idOrUsername) => `/users/${idOrUsername}`,
      providesTags: (result) => [{ type: "User", id: result?._id }],
    }),
    getUsers: build.query<PaginateResult<IUser>, FindAllUsersParams | void>({
      query: (params) => ({
        url: "/users",
        params: params ?? {},
      }),
      providesTags: (result) =>
        result?.docs
          ? [
              ...result.docs.map((user) => ({
                type: "User" as const,
                id: user._id,
              })),
              { type: "User" as const, id: "LIST" },
            ]
          : [{ type: "User" as const, id: "LIST" }],
    }),
    updateUser: build.mutation<IUser, { id: string; dto: UpdateUserDto }>({
      query: ({ id, dto }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: dto,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: "User", id },
        { type: "User", id: "LIST" },
      ],
    }),
    updateUserPassword: build.mutation<
      void,
      { id: string; dto: UpdatePasswordDto }
    >({
      query: ({ id, dto }) => ({
        url: `/users/${id}/password`,
        method: "PUT",
        body: dto,
      }),
    }),
    resendConfirmationEmail: build.mutation<void, void>({
      query: () => ({
        url: "/users/confirm-email",
        method: "POST",
      }),
    }),
    createPasswordReset: build.mutation<null, { usernameOrEmail: string }>({
      query: ({ usernameOrEmail }) => ({
        url: "/password-resets",
        method: "POST",
        body: { usernameOrEmail },
      }),
    }),
    checkPasswordReset: build.query<null, string>({
      query: (key) => ({
        url: `/password-resets/${key}`,
        method: "GET",
      }),
    }),
    resetPassword: build.mutation<null, { key: string; password: string }>({
      query: ({ key, password }) => ({
        url: `/password-resets/${key}`,
        method: "PATCH",
        body: { password },
      }),
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetUserQuery,
  useGetUsersQuery,
  useUpdateUserMutation,
  useUpdateUserPasswordMutation,
  useResendConfirmationEmailMutation,
  useLazyGetUserQuery,
  useLazyGetUsersQuery,
  useCheckPasswordResetQuery,
  useLazyCheckPasswordResetQuery,
  useResetPasswordMutation,
  useCreatePasswordResetMutation,
} = usersApi;
