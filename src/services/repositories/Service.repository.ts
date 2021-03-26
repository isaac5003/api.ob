import { EntityRepository, Repository } from 'typeorm';
import { Service } from '../entities/Service.entity';

@EntityRepository(Service)
export class ServiceRepository extends Repository<Service> {}
