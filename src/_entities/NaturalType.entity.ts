import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Company } from './Company.entity';

@Entity()
export class NaturalType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;
  @CreateDateColumn({ select: false })
  createdAt: string;

  @UpdateDateColumn({ select: false })
  updatedAt: string;

  @OneToMany(() => Company, (company) => company.naturalType)
  companies: Company[];
}
