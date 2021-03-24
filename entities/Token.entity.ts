import { Column, Entity } from 'typeorm';

@Entity('token')
export class Token {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', { name: 'token' })
  token: string;

  @Column('character varying', { name: 'active' })
  active: string;

  @Column('timestamp without time zone', {
    name: 'createdAt',
    default: () => 'now()',
  })
  createdAt: Date;
}
