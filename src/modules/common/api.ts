import axios, { AxiosError } from "axios";
import { AuthService } from "../users/services/auth.service";
import {
  REFRESH_TOKEN_NAME,
  TokenService,
} from "../users/services/token.service";
import { cookieExists } from "./utils/cookieExists";

export type ApiError = AxiosError<{ message?: string }>;

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (config.headers) {
    config.headers.Authorization = `Bearer ${TokenService.accessToken}`;
  }
  return config;
});

function createAxiosResponseInterceptor() {
  const interceptor = api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      if (error.response?.status !== 401 || !cookieExists(REFRESH_TOKEN_NAME)) {
        TokenService.clearTokens();
        return Promise.reject(error);
      }
      api.interceptors.response.eject(interceptor);
      return AuthService.refresh()
        .then(() => {
          if (error.config) {
            return api(error.config);
          }
        })
        .catch((refreshError) => {
          TokenService.clearTokens();
          return Promise.reject(refreshError);
        })
        .finally(createAxiosResponseInterceptor);
    }
  );
}
createAxiosResponseInterceptor();

export { api };
