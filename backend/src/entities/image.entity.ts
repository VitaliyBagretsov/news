import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'news' })
export class Image {
  @PrimaryGeneratedColumn({ comment: 'ID' })
  id: number;

  @Column({ comment: 'Id новости' })
  newsId: number;

  @Column({ comment: 'Url новости' })
  newsUrl: string;

  @Column({ type: 'text', nullable: true, comment: 'Адрес изображения' })
  src: string;

  @Column({
    type: 'text',
    nullable: true,
    default: '',
    comment: 'Подпись изображения',
  })
  alt: string;
}
