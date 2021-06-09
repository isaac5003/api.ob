import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Purchase } from './Purchase.entity';

@Entity()
export class PurchasesStatus extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn({ select: false })
  createdAt: string;

  // @OneToMany(() => Purchase, (purchase) => purchase.status)
  // purchases: Purchase[];
}
