import { Column, Entity, OneToMany } from 'typeorm';
import { Company } from './Company';

@Entity('natural_type')
export class NaturalType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', { name: 'name' })
  name: string;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @OneToMany(() => Company, (company) => company.naturalType)
  companies: Company[];
}
