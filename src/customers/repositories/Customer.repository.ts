import { BadRequestException, NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CustomerAddDTO } from '../dtos/customer-add-dto';
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

  async createCustomer(
    validatorCustomerDTO: CustomerAddDTO,
  ): Promise<{ message: string }> {
    try {
      const {
        name,
        shortName,
        isProvider,
        dui,
        nrc,
        nit,
        giro,
        customerType,
        customerTaxerType,
        customerTypeNatural,
      } = validatorCustomerDTO;

      const customer = await this.createQueryBuilder()
        .insert()
        .into('Customer')
        .values({
          name,
          shortName,
          isProvider,
          isCustomer: true,
          dui,
          nrc,
          nit,
          giro,
          isActiveProvider: false,
          customerTaxerType,
          customerType,
          customerTypeNatural,
        })
        .execute();

      // const user = await req.conn
      // .getRepository('User')
      // .createQueryBuilder('u')
      // .where('u.id = :id', { id: req.user.uid })
      // .getOne();

      // // crea sucursal
      //   try {
      //     // obtiene los campos requeridos
      //     let { contactName, contactInfo, address1, address2, country, state, city } = validatorCustomerDTO.branch;

      //     await this
      //       .createQueryBuilder()
      //       .insert()
      //       .into('CustomerBranch')
      //       .values({
      //         name: 'Sucursal Principal',
      //         contactName,
      //         contactInfo,
      //         address1,
      //         address2,
      //         customer: customer.raw[0].id,
      //         country,
      //         state,
      //         city,
      //       })
      //       .execute();

      //     await addLog(
      //       req.conn,
      //       req.moduleName,
      //       `${user.names} ${user.lastnames}`,
      //       user.id,
      //       `Se ha creado la sucursal: Sucursal Principal`,
      //     );

      //     return res.json({
      //       message: 'Se ha creado el cliente correctamente.',
      //       id: customer.raw[0].id,
      //     });
      //   } catch (error) {
      //     // on error
      //     return res.status(500).json({
      //       message: 'Error al crear la sucursal del cliente. Contacta con tu administrador.',
      //     });
      //   }
      return {
        message: 'Se ha creado el cliente correctamente.',
      };
      //id: customer.raw[0].id,
    } catch (error) {
      // on error
      console.error(error);
      return {
        message: 'Error al crear el cliente. Contacta con tu administrador',
      };
    }
  }
}
