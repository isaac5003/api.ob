import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { Access } from './Access';
import { Branch } from './Branch';
import { Company } from './Company';
import { User } from './User';

@Entity('profile')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', { name: 'name' })
  name: string;

  @Column('character varying', { name: 'description' })
  description: string;

  @Column('boolean', { name: 'editable', default: () => 'true' })
  editable: boolean;

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

  @Column('boolean', { name: 'admin', default: () => 'false' })
  admin: boolean;

  @OneToMany(() => Access, (access) => access.profile)
  accesses: Access[];

  @ManyToMany(() => Branch, (branch) => branch.profiles)
  branches: Branch[];

  @ManyToMany(() => Company, (company) => company.profiles)
  companies: Company[];

  @OneToMany(() => User, (user) => user.profile)
  users: User[];
}
