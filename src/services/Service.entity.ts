import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SellingType } from './SellingType.entity';

@Entity()
export class Service extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'float' })
  cost: number;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @Column({ type: 'boolean', default: false })
  incIva: boolean;

  @Column({ type: 'boolean', default: false })
  incRenta: boolean;

  @CreateDateColumn({ select: false })
  createdAt: string;

  @UpdateDateColumn({ select: false })
  updatedAt: string;

  @ManyToOne(() => SellingType, (sellingType) => sellingType.services)
  sellingType: SellingType;
}

//   relations: {
//     company: {
//       target: 'Company',
//       type: 'many-to-one',
//       joinTable: true,
//     },
//     sellingType: {
//       target: 'SellingType',
//       type: 'many-to-one',
//       joinTable: true,
//     },
//     accountingCatalog: {
//       target: 'AccountingCatalog',
//       type: 'many-to-one',
//       joinTable: true,
//     },
//   },
// });
