import { EntityRepository, Repository } from 'typeorm';
import { SellingType } from './SellingType.entity';

@EntityRepository(SellingType)
export class SellingTypeRepository extends Repository<SellingType> {}
