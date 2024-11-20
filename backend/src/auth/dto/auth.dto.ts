import { IsString, MaxLength, MinLength } from 'class-validator';

export class AuthDto {
  @IsString()
  @MaxLength(200)
  @MinLength(3)
  username: string;

  @IsString()
  @MaxLength(1000)
  @MinLength(3)
  password: string;
}
