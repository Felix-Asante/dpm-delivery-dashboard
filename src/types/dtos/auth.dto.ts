export interface AdminChangePasswordDto {
  newPassword: string;
  userId: string;
}

export interface ChangeDefaultPasswordDto {
  newPassword: string;
  oldPassword: string;
}
