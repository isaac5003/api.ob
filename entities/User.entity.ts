import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { City } from './City';
import { Country } from './Country';
import { Gender } from './Gender';
import { Profile } from './Profile';
import { State } from './State';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('character varying', { name: 'unique' })
  unique: string;

  @Column('character varying', { name: 'email' })
  email: string;

  @Column('character varying', { name: 'password' })
  password: string;

  @Column('character varying', { name: 'names' })
  names: string;

  @Column('character varying', { name: 'lastnames' })
  lastnames: string;

  @Column('date', { name: 'dob', nullable: true })
  dob: string;

  @Column('boolean', { name: 'changePassword', default: () => 'true' })
  changePassword: boolean;

  @Column('boolean', { name: 'isActive', default: () => 'true' })
  isActive: boolean;

  @Column('character varying', { name: 'avatarURL', nullable: true })
  avatarUrl: string;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @ManyToOne(() => City, (city) => city.users)
  @JoinColumn([{ name: 'cityId', referencedColumnName: 'id' }])
  city: City;

  @ManyToOne(() => Country, (country) => country.users)
  @JoinColumn([{ name: 'countryId', referencedColumnName: 'id' }])
  country: Country;

  @ManyToOne(() => Gender, (gender) => gender.users)
  @JoinColumn([{ name: 'genderId', referencedColumnName: 'id' }])
  gender: Gender;

  @ManyToOne(() => Profile, (profile) => profile.users)
  @JoinColumn([{ name: 'profileId', referencedColumnName: 'id' }])
  profile: Profile;

  @ManyToOne(() => State, (state) => state.users)
  @JoinColumn([{ name: 'stateId', referencedColumnName: 'id' }])
  state: State;
}
