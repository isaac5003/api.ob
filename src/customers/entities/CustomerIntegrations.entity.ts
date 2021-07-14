import { Company } from '../../companies/entities/Company.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Module } from '../../system/entities/Module.entity';

@Entity()
export class CustomerIntegrations extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  metaKey: string;

  @Column({ type: 'varchar', nullable: true })
  metaValue: string;

  @CreateDateColumn({ select: false })
  createdAt: string;

  @UpdateDateColumn({ select: false })
  updatedAt: string;

  @ManyToOne(() => Company, (company) => company.customerIntegration)
  company: Company;

  @ManyToOne(() => Module, (module) => module.customerIntegration)
  module: Module;
}
