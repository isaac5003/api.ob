import { EntityRepository, Repository } from 'typeorm';
import { Access } from '../entities/Access.entity';

@EntityRepository(Access)
export class AccessRepository extends Repository<Access> {}
