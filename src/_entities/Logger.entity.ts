import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Logger {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ select: false })
  createdAt: string;

  @UpdateDateColumn({ select: false })
  updatedAt: string;

  @Column()
  userId: string;

  @Column()
  module: string;

  @Column()
  detail: string;

  @Column()
  userName: string;
}
