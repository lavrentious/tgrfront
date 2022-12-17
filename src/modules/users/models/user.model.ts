export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
  VERIFIED = "VERIFIED",
  MODERATOR = "MODERATOR",
}

export interface User {
  _id: string;
  name?: string;
  email: string;
  username?: string;
  emailConfirmed: boolean;
  role: Role;
  createdAt: string;
  updatedAt: string;
}
