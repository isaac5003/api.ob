import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Branch } from './Branch';
import { Company } from './Company';
import { Module } from './Module';
import { Profile } from './Profile';

@Entity('access')
export class Access {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('json', { name: 'permissions' })
  permissions: object;

  @Column('timestamp without time zone', {
    name: 'createdAt',
    default: () => 'now()',
  })
  createdAt: Date;

  @Column('timestamp without time zone', {
    name: 'updatedAt',
    default: () => 'now()',
  })
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
