import { api } from "src/api/api";

const BASE_URL = "/password-resets";

export const passwordResetsApi = api.injectEndpoints({
  endpoints: (build) => ({
    create: build.mutation<null, { usernameOrEmail: string }>({
      query: (body) => ({
        url: BASE_URL,
        method: "POST",
        body,
      }),
    }),
    check: build.query<null, string>({
      query: (key) => ({
        url: `${BASE_URL}/${key}`,
        method: "GET",
      }),
    }),
    reset: build.mutation<null, { key: string; password: string }>({
      query: ({ key, password }) => ({
        url: `${BASE_URL}/${key}`,
        method: "PATCH",
        body: { password },
      }),
    }),
  }),
});

export const { useCreateMutation, useCheckQuery, useResetMutation } =
  passwordResetsApi;
