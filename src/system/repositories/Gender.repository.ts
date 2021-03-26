import { EntityRepository, Repository } from 'typeorm';
import { Gender } from '../entities/Gender.entity';

@EntityRepository(Gender)
export class GenderRepository extends Repository<Gender> {}
