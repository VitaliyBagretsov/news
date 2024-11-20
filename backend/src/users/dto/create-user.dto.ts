import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MaxLength(200)
  @MinLength(3)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(1000)
  @MinLength(3)
  password: string;

  @IsString()
  @IsOptional()
  refreshToken: string;
}
