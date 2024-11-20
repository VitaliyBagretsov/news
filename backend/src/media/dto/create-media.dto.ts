import { IsBoolean, IsEmail, IsString } from 'class-validator';

export class CreateMediaDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  url: string;

  @IsString()
  copyright: string;

  @IsString()
  contact: string;

  @IsString()
  chiefEditor: string;

  @IsString()
  address: string;

  @IsString()
  phone: string;

  @IsEmail()
  email: string;

  @IsBoolean()
  isActive: boolean;
}
