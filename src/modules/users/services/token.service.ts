export const REFRESH_TOKEN_NAME = "refreshToken";
export const ACCESS_TOKEN_NAME = "token";

export const TokenService = {
  get accessToken() {
    return localStorage.getItem("token");
  },
  set accessToken(value: string | null) {
    if (value) {
      localStorage.setItem("token", value);
    } else {
      localStorage.removeItem("token");
    }
  },
  clear() {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  },
};
