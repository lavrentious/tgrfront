export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
  VERIFIED = "VERIFIED",
  MODERATOR = "MODERATOR",
}

export class User {
  _id: string;
  email?: string;
  name?: string | null;
  username?: string | null;
  emailConfirmed?: boolean;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}
