import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'news' })
export class Link {
  @PrimaryGeneratedColumn({ comment: 'ID' })
  id: number;

  @Column({ comment: 'id новости' })
  newsId: number;

  @Column({ comment: 'Url новости' })
  newsUrl: string;

  @Column({ type: 'text', nullable: true, comment: 'адрес ссылки' })
  href: string;

  @Column({ type: 'text', nullable: true, default: '', comment: 'тип ссылки' })
  rel: string;

  @Column({
    type: 'text',
    nullable: true,
    default: '',
    comment: 'Текст гиперссылки',
  })
  textContent: string;
}
