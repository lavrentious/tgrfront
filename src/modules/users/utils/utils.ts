import { type IUser, User } from "../models/user.model";

export function createUser(user: IUser): User {
  /***
   * used for casl to detect subject type
   *
   */
  return new User(user);
}
