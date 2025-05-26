import type { BaseQueryFn, FetchArgs } from "@reduxjs/toolkit/query";
import {
  fetchBaseQuery,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { REFRESH_URL, type AuthResponse } from "src/modules/users/api/types";
import { TokenService } from "src/modules/users/services/token.service";
import { setUser } from "src/store/auth.reducer";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = TokenService.accessToken;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401 && TokenService.accessToken) {
    // Try refreshing the token
    const refreshResult = await baseQuery(REFRESH_URL, api, extraOptions);

    if (refreshResult.data) {
      const { accessToken, user } = refreshResult.data as AuthResponse;
      TokenService.accessToken = accessToken;
      api.dispatch(setUser(user));

      // Retry the original query
      result = await baseQuery(args, api, extraOptions);
    } else {
      TokenService.clear();
      api.dispatch(setUser(null));
    }
  }

  return result;
};
