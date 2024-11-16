import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity({ schema: 'news' })
export class Log {

  @PrimaryGeneratedColumn({ comment: 'ID' })
  id: number;

  @Column({ comment: 'Тип' })
  type: string

  @Column({ comment: 'Значение' })
  value: string

  @CreateDateColumn({ comment: 'timestamp' })
  timestamp: Date

}