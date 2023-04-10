export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
  VERIFIED = "VERIFIED",
  MODERATOR = "MODERATOR",
}

export class User {
  _id: string;
  name?: string;
  email?: string;
  username?: string;
  emailConfirmed?: boolean;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}
