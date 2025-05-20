export interface UpdatePasswordDto {
  oldPassword: string;
  newPassword: string;
  logout?: boolean;
}
