export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
  VERIFIED = "VERIFIED",
  MODERATOR = "MODERATOR",
}

export interface User {
  _id: string;
  email?: string;
  name?: string | null;
  username?: string | null;
  emailConfirmed?: boolean;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}
export class User implements User {
  constructor(user: User) {
    Object.assign(this, user);
    this.createdAt = new Date(user.createdAt);
    this.updatedAt = new Date(user.updatedAt);
  }
}
