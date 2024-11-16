import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'news' })
export class Image {

  @PrimaryGeneratedColumn({ comment: 'ID' })
  id: number;

  @Column({ comment: 'Id новости' })
  newsId: number

  @Column({ comment: 'Url новости' })
  newsUrl: string

  @Column({ comment: 'Адрес изображения' })
  src: string

  @Column({ comment: 'Подпись изображения' })
  alt: string

}