import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Gender } from './GenderEntity';
import { Profile } from './ProfileEntity';
import { City } from './CityEntity';
import { Country } from './CountryEntity';
import { State } from './StateEntity';

@Entity('user')
export class User {
  @Column('uuid', {
    primary: true,
    name: 'id',
    default: () => 'uuid_generate_v4()',
  })
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

  @ManyToOne(() => Gender, (gender) => gender.users)
  @JoinColumn([{ name: 'genderId', referencedColumnName: 'id' }])
  gender: Gender;

  @ManyToOne(() => Profile, (profile) => profile.users)
  @JoinColumn([{ name: 'profileId', referencedColumnName: 'id' }])
  profile: Profile;

  @ManyToOne(() => City, (city) => city.users)
  @JoinColumn([{ name: 'cityId', referencedColumnName: 'id' }])
  city: City;

  @ManyToOne(() => Country, (country) => country.users)
  @JoinColumn([{ name: 'countryId', referencedColumnName: 'id' }])
  country: Country;

  @ManyToOne(() => State, (state) => state.users)
  @JoinColumn([{ name: 'stateId', referencedColumnName: 'id' }])
  state: State;
}
