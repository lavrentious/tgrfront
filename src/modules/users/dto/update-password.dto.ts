export class UpdatePasswordDto {
  oldPassword: string;
  newPassword: string;
  logout?: boolean;
}
