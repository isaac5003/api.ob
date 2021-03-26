import { EntityRepository, Repository } from 'typeorm';
import { Customer } from '../entities/Customer.entity';

@EntityRepository(Customer)
export class CustomerRepository extends Repository<Customer> {}
