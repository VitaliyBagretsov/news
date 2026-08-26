import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MaxLength(200)
  @MinLength(3)
  name: string;

  @IsEmail()
  email: string;
}
