import { EntityRepository, Repository } from 'typeorm';
import { CompanyType } from '../entities/CompanyType.entity';

@EntityRepository(CompanyType)
export class CompanyTypeRepository extends Repository<CompanyType> {}
