import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'news' })
export class Link {

  @PrimaryGeneratedColumn({ comment: 'ID' })
  id: number;

  @Column({ comment: 'id новости' })
  newsId: number

  @Column({ comment: 'Url новости' })
  newsUrl: string

  @Column({ comment: 'адрес ссылки' })
  href: string

  @Column({ comment: 'тип ссылки' })
  rel: string
  
  @Column({ comment: 'Текст гиперссылки' })
  textContent: string

}