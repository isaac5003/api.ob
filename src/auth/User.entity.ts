import { City } from 'src/_entities/City.entity';
import { Country } from 'src/_entities/Country.entity';
import { Gender } from 'src/_entities/Gender.entity';
import { State } from 'src/_entities/State.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Profile } from './Profile.entity';

@Entity()
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

  @Column({ type: 'date', nullable: true })
  dob: string;

  @Column({ type: 'boolean', default: true })
  changePassword: boolean;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ nullable: true })
  avatarURL: string;

  @CreateDateColumn({ select: false })
  createdAt: string;

  @UpdateDateColumn({ select: false })
  updatedAt: string;

  @ManyToOne(() => Gender, (gender) => gender.users)
  gender: Gender;

  @ManyToOne(() => Profile, (profile) => profile.users)
  profile: Profile;

  @ManyToOne(() => Country, (country) => country.users)
  country: Country;

  @ManyToOne(() => State, (state) => state.users)
  state: State;

  @ManyToOne(() => City, (city) => city.users)
  city: City;
}
