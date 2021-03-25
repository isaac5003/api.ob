import { Column, Entity, OneToMany } from 'typeorm';
import { Access } from './Access';

@Entity('module')
export class Module {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', { name: 'name' })
  name: string;

  @Column('character varying', { name: 'description' })
  description: string;

  @Column('json', { name: 'access' })
  access: string;

  @Column('boolean', { name: 'reserved', default: () => 'false' })
  reserved: boolean;

  @Column('boolean', { name: 'system', default: () => 'false' })
  system: boolean;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @OneToMany(() => Access, (access) => access.module)
  accesses: Access[];
}
