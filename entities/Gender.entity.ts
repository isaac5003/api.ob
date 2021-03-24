import { Column, Entity, OneToMany } from 'typeorm';
import { User } from './User';

@Entity('gender')
export class Gender {
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

  @OneToMany(() => User, (user) => user.gender)
  users: User[];
}
