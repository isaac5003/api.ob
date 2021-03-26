import { EntityRepository, Repository } from 'typeorm';
import { SellingType } from '../entities/SellingType.entity';

@EntityRepository(SellingType)
export class SellingTypeRepository extends Repository<SellingType> {}
