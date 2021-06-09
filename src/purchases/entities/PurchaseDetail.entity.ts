import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Purchase } from './Purchase.entity';

@Entity()
export class PurchaseDetail extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float' })
  quantity: number;

  @Column({ type: 'float' })
  unitPrice: number;

  @Column()
  incTax: boolean;

  @Column({ type: 'float' })
  ventaPrice: number;

  @CreateDateColumn({ select: false })
  createdAt: string;

  @UpdateDateColumn({ select: false })
  updatedAt: string;

  @Column()
  chargeDescription: string;

  @ManyToOne(() => Purchase, (purchase) => purchase.purchaseDetails)
  purchase: Purchase;
}
