import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ArrayMinSize, Contains, IsArray, IsBoolean, IsEmail, IsNumber, IsString } from 'class-validator';

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
  phone: number;

  @IsEmail()
  email: string;

  @IsBoolean()
  isActive: boolean;
}
