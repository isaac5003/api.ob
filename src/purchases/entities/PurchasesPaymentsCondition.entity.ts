import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Company } from '../../companies/entities/Company.entity';
import { Purchase } from './Purchase.entity';

@Entity()
export class PurchasesPaymentsCondition extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn({ select: false })
  createdAt: string;

  @UpdateDateColumn({ select: false })
  updatedAt: string;

  @Column({ default: false })
  cashPayment: boolean;

  @OneToMany(() => Purchase, (purchase) => purchase.purchasePaymentsCondition)
  purchases: Purchase[];

  @ManyToOne(() => Company, (company) => company.invoicesPaymentsConditions)
  company: Company;
}
