import { api } from "src/api/api";
import type { LoginDto } from "src/modules/users/dto/login.dto";
import type { RegisterDto } from "src/modules/users/dto/register.dto";
import type { AuthResponse } from "./types";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginDto>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),
    register: builder.mutation<AuthResponse, RegisterDto>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "DELETE",
      }),
    }),
    refresh: builder.query<AuthResponse, void>({
      query: () => ({
        url: "/auth/refresh",
        method: "GET",
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation } =
  authApi;
