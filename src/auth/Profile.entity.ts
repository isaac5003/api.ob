import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './User.entity';

@Entity()
export class Profile extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'boolean', default: true })
  editable: boolean;

  @Column({ type: 'boolean', default: false })
  admin: boolean;

  @CreateDateColumn({ select: false })
  createdAt: string;

  @UpdateDateColumn({ select: false })
  updatedAt: string;

  @OneToMany(() => User, (user) => user.profile)
  users: User[];
}
//TODO

//   relations: {
//     access: {
//       target: "Access",
//       type: "one-to-many",
//       joinTable: true,
//       joinColumn: true,
//       inverseSide: "profile",
//     },
//   },
// });
