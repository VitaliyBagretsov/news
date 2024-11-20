import { IsString, Max, Min } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'news' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
    type: 'varchar',
    length: 200,
    comment: 'Имя пользователя',
  })
  name: string;

  @Column({
    unique: true,
    type: 'varchar',
    length: 200,
    comment: 'E-mail',
  })
  email: string;

  @Column({
    unique: true,
    type: 'varchar',
    length: 1000,
    comment: 'Пароль',
  })
  password: string;

  @Column({
    nullable: true,
    comment: 'refresh-token',
  })
  refreshToken: string;
}
