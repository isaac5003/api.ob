import { EntityRepository, Repository } from 'typeorm';
import { Access } from '../entities/Access.entity';

@EntityRepository(Access)
export class AccessTypeRepository extends Repository<Access> {}
