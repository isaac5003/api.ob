import { EntityRepository, Repository } from 'typeorm';
import { Branch } from '../entities/Branch.entity';

@EntityRepository(Branch)
export class BranchRepository extends Repository<Branch> {}
