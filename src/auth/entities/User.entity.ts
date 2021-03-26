import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Gender } from '../../_entities/Gender.entity';
import { Profile } from './Profile.entity';
import { City } from '../../_entities/City.entity';
import { Country } from '../../_entities/Country.entity';
import { State } from '../../_entities/State.entity';

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  unique: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  names: string;

  @Column()
  lastnames: string;

  @Column({ nullable: true })
  dob: string;

  @Column({ default: true })
  changePassword: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
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
