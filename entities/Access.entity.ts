import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Branch } from './Branch.entity';
import { Company } from './Company.entity';
import { Module } from './Module.entity';
import { Profile } from './Profile.entity';

@Entity()
export class Access {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  permissions: string;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @ManyToOne(() => Branch, (branch) => branch.accesses)
  @JoinColumn([{ name: 'branchId', referencedColumnName: 'id' }])
  branch: Branch;

  @ManyToOne(() => Company, (company) => company.accesses)
  @JoinColumn([{ name: 'companyId', referencedColumnName: 'id' }])
  company: Company;

  @ManyToOne(() => Module, (module) => module.accesses)
  @JoinColumn([{ name: 'moduleId', referencedColumnName: 'id' }])
  module: Module;

  @ManyToOne(() => Profile, (profile) => profile.accesses)
  @JoinColumn([{ name: 'profileId', referencedColumnName: 'id' }])
  profile: Profile;
}
