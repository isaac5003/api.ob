import { EntityRepository, Repository } from 'typeorm';
import { CustomerBranch } from './CustomerBranch.entity';

@EntityRepository(CustomerBranch)
export class CustomerBranchRepository extends Repository<CustomerBranch> {}
