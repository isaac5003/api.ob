import { Company } from '../../companies/entities/Company.entity';
import { BaseEntity, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { AccountingCatalog } from '../../entries/entities/AccountingCatalog.entity';
import { Module } from 'src/system/entities/Module.entity';

@Entity()
export class CustomerIntegrations extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  metaKey;
  metaValue;

  @CreateDateColumn({ select: false })
  createdAt: string;

  @UpdateDateColumn({ select: false })
  updatedAt: string;

  @ManyToOne(() => Company, (company) => company.customerIntegrations)
  company: Company;

  @ManyToOne(() => Module, (module) => module.customerIntegration)
  module: Module;
}
