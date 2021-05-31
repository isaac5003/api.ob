import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User.entity';

@Entity()
export class Recovery extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  token: string;

  @Column({ default: false })
  used: boolean;

  @CreateDateColumn()
  createdAt: string;

  @ManyToOne(() => User, (user) => user)
  user: User;
}
