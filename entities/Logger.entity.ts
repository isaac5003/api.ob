import { Column, Entity } from 'typeorm';

@Entity('logger')
export class Logger {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', { name: 'userID' })
  userId: string;

  @Column('character varying', { name: 'userName' })
  userName: string;

  @Column('character varying', { name: 'module' })
  module: string;

  @Column('character varying', { name: 'detail' })
  detail: string;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;
}
