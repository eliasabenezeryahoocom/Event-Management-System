import { IsString, IsEmail } from 'class-validator';

export class DeleteUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
