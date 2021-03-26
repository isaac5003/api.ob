import { Branch } from 'src/companies/entities/Branch.entity';
import { Company } from 'src/companies/entities/Company.entity';
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
import { Profile } from './Profile.entity';

@Entity()
export class Access extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'json' })
  permissions: string;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @ManyToOne(() => Branch, (branch) => branch.accesses)
  branch: Branch;

  @ManyToOne(() => Company, (company) => company.accesses)
  company: Company;

  @ManyToOne(() => Module, (module) => module.accesses)
  module: Module;

  @ManyToOne(() => Profile, (profile) => profile.accesses)
  profile: Profile;
}
