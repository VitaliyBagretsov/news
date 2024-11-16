import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'news' })
export class News {
  @PrimaryGeneratedColumn({ comment: 'Внутренний идентрификатор новости' })
  id: number;

  @Column({
    comment: 'Идентификатор СМИ'
  })
  mediaId: number;

  @Column({
    comment: 'Внешний идентификатор новости'
  })
  externalId: string;

  @Column({
    comment: 'Внешний код новости'
  })
  externalCode: string;

  @Column({
    type: 'timestamp',
    nullable: false,
    comment: 'Дата новости',
  })
  date: Date;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    comment: 'Заголовок новости',
  })
  header: string;

  @Column({
    type: 'varchar',
    nullable: true,
    comment: 'Краткий текст новости',
  })
  summary: string;

  @Column({
    type: 'varchar',
    nullable: true,
    comment: 'Подробный текст новости',
  })
  text: string;
  
  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
    unique: true,
    comment: 'Ссылка на новость',
  })
  url: string;

}
