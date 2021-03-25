import { Column, Entity, OneToMany } from 'typeorm';
import { User } from './User';

@Entity('gender')
export class Gender {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', { name: 'name' })
  name: string;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @OneToMany(() => User, (user) => user.gender)
  users: User[];
}
