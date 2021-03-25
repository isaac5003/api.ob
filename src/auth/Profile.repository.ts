import { EntityRepository, Repository } from 'typeorm';
import { Profile } from './Profile.entity';

@EntityRepository(Profile)
export class ProfileRepository extends Repository<Profile> {}
