import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Purchase } from './Purchase.entity';

@Entity()
export class PurchasesDocumentType extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column({ type: 'boolean', default: false })
  includeInTaxes: boolean;

  @CreateDateColumn({ select: false })
  createdAt: string;

  @UpdateDateColumn({ select: false })
  updatedAt: string;

  @OneToMany(() => Purchase, (purchase) => purchase.documentType)
  purchases: Purchase[];
}
