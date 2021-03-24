import { Column, Entity, OneToMany } from 'typeorm';
import { Company } from './Company';

@Entity('natural_type')
export class NaturalType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', { name: 'name' })
  name: string;

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

  @OneToMany(() => Company, (company) => company.naturalType)
  companies: Company[];
}
