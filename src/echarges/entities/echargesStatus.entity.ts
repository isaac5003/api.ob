import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Echarges } from './echarges.entity';

@Entity()
export class EchargesStatus extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @CreateDateColumn({ select: false })
  createdAt: string;

  @OneToMany(() => Echarges, (echarges) => echarges.status)
  echarges: Echarges;
}
