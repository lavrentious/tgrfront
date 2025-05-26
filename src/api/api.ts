import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export interface HealthCheckResult {
  version: string;
  lastCommitDate: string;
}
export type ApiError = {
  statusCode: number;
  message: string;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Record", "Auth"],
  endpoints: (builder) => ({
    getHealth: builder.query<HealthCheckResult, void>({
      query: () => ({
        url: "/",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetHealthQuery } = api;
