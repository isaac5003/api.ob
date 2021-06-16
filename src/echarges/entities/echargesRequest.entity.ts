import { BaseEntity, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Echarges } from './echarges.entity';
import { User } from 'src/auth/entities/User.entity';

@Entity()
export class EchargesRequest extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: string;

  @ManyToOne(() => Echarges, (echarges) => echarges.request)
  echarges: Echarges;

  @ManyToOne(() => User, (user) => user.request)
  user: User;
}
