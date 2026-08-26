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
}
