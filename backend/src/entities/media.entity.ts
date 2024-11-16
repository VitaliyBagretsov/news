import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'news' })
export class Media {
  @PrimaryGeneratedColumn({ comment: 'Идентификатор СМИ' })
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    comment: 'Заглавное название СМИ',
  })
  title: string;

  @Column({
    type: 'varchar',
    length: 5000,
    nullable: true,
    comment: 'Описание СМИ',
  })
  description: string;
  
  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
    unique: true,
    comment: 'Ссылка на сайт СМИ',
  })
  url: string;

  @Column({
    type: 'varchar',
    length: 5000,
    nullable: true,
    comment: 'CopyRight',
  })
  copyright: string;

  @Column({
    type: 'varchar',
    length: 5000,
    nullable: true,
    comment: 'Контакты СМИ',
  })
  contact: string;
  
  @Column({
    type: 'varchar',
    length: 300,
    nullable: true,
    comment: 'Главный редактор',
  })
  chiefEditor: string;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: 'Адрес',
  })
  address: string;

  @Column({
    type: 'varchar',
    length: 0,
    nullable: true,
    comment: 'Телефон',
  })
  phone: string;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
    comment: 'E-mail',
  })
  email: string;

  @Column({
    type: 'boolean',
    default: true,
    nullable: false,
    comment: 'Активность для сбора',
  })
  isActive: boolean;

  @Column({
    type: 'varchar',
    nullable: true,
    comment: 'Ссылка на логотип',
  })
  logo: string;
}
