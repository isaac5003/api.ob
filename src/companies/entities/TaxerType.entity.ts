import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Company } from './Company.entity';

@Entity()
export class TaxerType extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @CreateDateColumn({ select: false })
  createdAt: string;

  @UpdateDateColumn({ select: false })
  updatedAt: string;

  @OneToMany(() => Company, (company) => company.taxerType)
  companies: Company[];
}
