import { EntityRepository, Repository } from 'typeorm';
import { Service } from './Service.entity';

@EntityRepository(Service)
export class ServiceRepository extends Repository<Service> {}
