import { BadRequestException, NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CustomerFilterDTO } from '../dtos/customer-filter.dto';
import { Customer } from '../entities/Customer.entity';

@EntityRepository(Customer)
export class CustomerRepository extends Repository<Customer> {
  async getCustomers(filterDto: CustomerFilterDTO): Promise<Customer[]> {
    const { active, limit, page, search, order, prop } = filterDto;
    const query = this.createQueryBuilder('customer')
      .leftJoinAndSelect('customer.customerType', 'customerType')
      .leftJoinAndSelect('customer.customerTypeNatural', 'customerTypeNatural');

    if (active) {
      query.andWhere('customer.isActiveCustomer = :active', { active });
    }

    if (search) {
      query.andWhere('(LOWER(customer.name) LIKE :search)', {
        search: `%${search}%`,
      });
    }

    if (limit && page) {
      query.take(limit).skip(limit ? (page ? page - 1 : 0) * limit : null);
    }

    if (order && prop) {
      query.orderBy(`customer.${prop}`, order == 'ascending' ? 'ASC' : 'DESC');
    } else {
      query.orderBy('customer.createdAt', 'DESC');
    }

    return await query.getMany();
  }

  async getCustomerById(id: string): Promise<Customer> {
    let customer: Customer;
    try {
      customer = await this.createQueryBuilder('customer')
        .where('customer.id = :id', { id })
        .leftJoinAndSelect('customer.customerType', 'customerType')
        .leftJoinAndSelect(
          'customer.customerTypeNatural',
          'customerTypeNatural',
        )
        .getOne();
    } catch (error) {
      throw new BadRequestException(
        'Error al obtener el servicio seleccionado.',
      );
    }

    if (!customer) {
      throw new NotFoundException('El servicio seleccionado no existe.');
    }

    return customer;
  }
}
