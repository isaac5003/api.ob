import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Logger extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ select: false })
  createdAt: string;

  @UpdateDateColumn({ select: false })
  updatedAt: string;

  @Column({ type: 'varchar' })
  userId: string;

  @Column({ type: 'varchar' })
  module: string;

  @Column({ type: 'varchar' })
  detail: string;

  @Column({ type: 'varchar' })
  userName: string;
}
