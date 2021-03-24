import { Column, Entity } from 'typeorm';

@Entity('logger')
export class Logger {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', { name: 'userID' })
  userId: string;

  @Column('character varying', { name: 'userName' })
  userName: string;

  @Column('character varying', { name: 'module' })
  module: string;

  @Column('character varying', { name: 'detail' })
  detail: string;

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
}
