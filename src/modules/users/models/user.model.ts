export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
  VERIFIED = "VERIFIED",
  MODERATOR = "MODERATOR",
}

export interface User {
  name?: string;
  email: string;
  username?: string;
  password: string;
  emailConfirmed: boolean;
  role: Role;
}