import { EntityRepository, Repository } from 'typeorm';
import { Profile } from '../entities/Profile.entity';

@EntityRepository(Profile)
export class ProfileRepository extends Repository<Profile> {}
