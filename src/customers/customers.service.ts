import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerFilterDTO } from './dtos/customer-filter.dto';
import { Customer } from './entities/Customer.entity';
import { CustomerRepository } from './repositories/Customer.repository';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(CustomerRepository)
    private customerRepository: CustomerRepository,
  ) {}

  async getCustomers(filterDto: CustomerFilterDTO): Promise<Customer[]> {
    return this.customerRepository.getCustomers(filterDto);
  }
}
