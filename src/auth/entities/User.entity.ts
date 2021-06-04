import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Gender } from '../../system/entities/Gender.entity';
import { Profile } from './Profile.entity';
import { City } from '../../system/entities/City.entity';
import { Country } from '../../system/entities/Country.entity';
import { State } from '../../system/entities/State.entity';

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  unique: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar' })
  names: string;

  @Column({ type: 'varchar' })
  lastnames: string;

  @Column({ nullable: true, type: 'date' })
  dob: string;

  @Column({ default: true, type: 'boolean' })
  changePassword: boolean;

  @Column({ default: true, type: 'boolean' })
  isActive: boolean;

  @Column({ nullable: true, type: 'varchar' })
  avatarUrl: string;

  @CreateDateColumn({ select: false })
  createdAt: string;

  @UpdateDateColumn({ select: false })
  updatedAt: string;

  @ManyToOne(() => Gender, (gender) => gender.users)
  gender: Gender;

  @ManyToOne(() => Profile, (profile) => profile.users)
  profile: Profile;

  @ManyToOne(() => City, (city) => city.users)
  city: City;

  @ManyToOne(() => Country, (country) => country.users)
  country: Country;

  @ManyToOne(() => State, (state) => state.users)
  state: State;
}
