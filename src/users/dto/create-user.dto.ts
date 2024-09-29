import { IsEmail, IsNotEmpty, MaxLength } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MaxLength(50)
  password: string;

  refreshToken?: string;
}
