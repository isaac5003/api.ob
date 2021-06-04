import { EntityRepository, Repository } from 'typeorm';
import { NaturalType } from '../entities/NaturalType.entity';

@EntityRepository(NaturalType)
export class NaturalTypeRepository extends Repository<NaturalType> {}
