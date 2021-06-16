import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Echarges } from './echarges.entity';

@Entity()
export class EchargesResponses extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  transaction: string;

  @Column({ type: 'varchar' })
  authorization: string;

  @Column({ type: 'boolean' })
  approved: boolean;

  @CreateDateColumn()
  createdAt: string;

  @ManyToOne(() => Echarges, (echarges) => echarges.response)
  echarges: Echarges;
}
