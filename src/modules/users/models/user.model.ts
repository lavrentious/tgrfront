export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
  VERIFIED = "VERIFIED",
  MODERATOR = "MODERATOR",
}

export interface IUser {
  _id: string;
  email?: string;
  name?: string | null;
  username?: string | null;
  emailConfirmed?: boolean;
  role: Role;
  createdAt?: Date;
  updatedAt?: Date;
}

// used for casl
export class User implements IUser {
  _id: string;
  email?: string | undefined;
  name?: string | null | undefined;
  username?: string | null | undefined;
  emailConfirmed?: boolean | undefined;
  role: Role;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
  constructor(user: IUser) {
    if (user.createdAt) this.createdAt = new Date(user.createdAt);
    if (user.updatedAt) this.updatedAt = new Date(user.updatedAt);
    this._id = user._id;
    this.email = user.email;
    this.name = user.name;
    this.username = user.username;
    this.emailConfirmed = user.emailConfirmed;
    this.role = user.role;
  }
}
