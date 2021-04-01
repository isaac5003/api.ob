import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CustomerValidateDTO } from '../dtos/customer-validator.dto';
import { CustomerFilterDTO } from '../dtos/customer-filter.dto';
import { Customer } from '../entities/Customer.entity';
import { CustomerStatusDTO } from '../dtos/status-validator-dto';
import { CustomerIntegrationDTO } from '../dtos/customer-integration.dto';
import { Company } from 'src/companies/entities/Company.entity';
import { CustomerBranch } from '../entities/CustomerBranch.entity';
import { ResponseMinimalDTO } from 'src/_dtos/responseList.dto';

const reponame = 'clientes';
@EntityRepository(Customer)
export class CustomerRepository extends Repository<Customer> {
  async getCustomers(filterDto: CustomerFilterDTO): Promise<Customer[]> {
    try {
      const { active, limit, page, search, order, prop } = filterDto;
      const query = this.createQueryBuilder('customer')
        .leftJoinAndSelect('customer.customerType', 'customerType')
        .leftJoinAndSelect(
          'customer.customerTypeNatural',
          'customerTypeNatural',
        );

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
        query.orderBy(
          `customer.${prop}`,
          order == 'ascending' ? 'ASC' : 'DESC',
        );
      } else {
        query.orderBy('customer.createdAt', 'DESC');
      }

      return await query.getMany();
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al obtener el listado de clientes. Contacta con tu administrador',
      );
    }
  }

  async getCustomer(company: Company, id: string): Promise<Customer> {
    let customer: Customer;
    try {
      customer = await this.findOne({ id, company });
    } catch (error) {
      throw new BadRequestException(
        'Error al obtener el cliente seleccionado.',
      );
    }

    if (!customer) {
      throw new NotFoundException('El cliente seleccionado no existe.');
    }

    return customer;
  }

  async createCustomer(
    company: Company,
    validatorCustomerDTO: CustomerValidateDTO,
  ): Promise<Customer> {
    let response: Customer;
    try {
      const customer = this.create({ company, ...validatorCustomerDTO });
      response = await this.save(customer);
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        'Error al crear el cliente, se ha notificado a su administrador.',
      );
    }
    return await response;
  }
  async updateCustomer(
    company: Company,
    id: string,
    updateDTO: CustomerValidateDTO | CustomerStatusDTO | CustomerIntegrationDTO,
  ): Promise<any> {
    return this.update({ id, company }, updateDTO);
  }

  // // // async deleteCustomer(id: string): Promise<{ message: string }> {
  // // //   // If no references deletes
  // // //   try {
  // // //     await this.createQueryBuilder()
  // // //       .delete()
  // // //       .from('Customer')
  // // //       .where('id = :id', { id })
  // // //       // .andWhere('company = :company', { company: req.user.cid })
  // // //       .execute();

  // // //     // const user = await req.conn
  // // //     //   .getRepository('User')
  // // //     //   .createQueryBuilder('u')
  // // //     //   .where('u.id = :id', { id: req.user.uid })
  // // //     //   .getOne();

  // // //     // await addLog(
  // // //     //   req.conn,
  // // //     //   req.moduleName,
  // // //     //   `${user.names} ${user.lastnames}`,
  // // //     //   user.id,
  // // //     //   `Se elimino el cliente con nombre: ${customer.name}.`,
  // // //     // );

  // // //     return {
  // // //       message: 'El cliente ha sido eliminado correctamente.',
  // // //     };
  // // //   } catch (error) {
  // // //     console.error(error);
  // // //     // on error
  // // //     console.error(error);
  // // //     throw new InternalServerErrorException(
  // // //       'Error al eliminar el cliente. Contacta con tu administrador',
  // // //     );
  // // //   }
  // // // }

  // async updateCustomerStatus(
  //   id: string,
  //   validatorCustomerStatusDTO: CustomerValidateStatusDTO,
  // ): Promise<{ message: string }> {
  //   const { status } = validatorCustomerStatusDTO;

  //   await this.getCustomerById(id);
  //   // If customer exist updates it
  //   try {
  //     // return success
  //     await this.createQueryBuilder()
  //       .update('Customer')
  //       .set({ isActiveCustomer: status })
  //       //TODO
  //       // .where('company = :company', { company: req.user.cid })
  //       .where('id = :id', { id })
  //       .execute();

  //     //TODO
  //     // const user = await req.conn
  //     //   .getRepository('User')
  //     //   .createQueryBuilder('u')
  //     //   .where('u.id = :id', { id: req.user.uid })
  //     //   .getOne();

  //     // await addLog(
  //     //   req.conn,
  //     //   req.moduleName,
  //     //   `${user.names} ${user.lastnames}`,
  //     //   user.id,
  //     //   `Se cambio el estado del cliente: ${customer.name} a ${
  //     //     status ? 'ACTIVO' : 'INACTIVO'
  //     //   }.`,
  //     // );

  //     return {
  //       message: 'El estado del cliente ha sido actualizado correctamente.',
  //     };
  //   } catch (error) {
  //     // return error
  //     throw new InternalServerErrorException(
  //       'Error al actualizar el estado del cliente. Contacta con tu administrador.',
  //     );
  //   }
  // }

  // async getCustomerIntegration(
  //   id: string,
  // ): Promise<{ integrations: any | null }> {
  //   const customer = await this.getCustomerById(id);
  //   console.log(customer);
  //   try {
  //     return {
  //       integrations: {
  //         catalog: customer.accountingCatalog
  //           ? customer.accountingCatalog.id
  //           : null,
  //       },
  //     };
  //   } catch (error) {
  //     // return error
  //     throw new InternalServerErrorException(
  //       'Error al obtener la configuracion de integración del cliente. Contacta con tu administrador.',
  //     );
  //   }
  // }

  // async updateCustomerIntegration(
  //   id: string,
  //   account: any | null,
  // ): Promise<{ message: string }> {
  //   await this.getCustomerById(id);
  //   //validate that account can be use
  //   if (account.isParent) {
  //     throw new BadRequestException(
  //       'La cuenta selecciona no puede ser utilizada ya que no es asignable',
  //     );
  //   }

  //   // If account exist updates intergations it
  //   try {
  //     // return success
  //     await this.createQueryBuilder()
  //       .update('Customer')
  //       .set({ accountingCatalog: account.id })
  //       .where('id = :id', { id })
  //       .execute();

  //     // const user = await req.conn
  //     //   .getRepository('User')
  //     //   .createQueryBuilder('u')
  //     //   .where('u.id = :id', { id: req.user.uid })
  //     //   .getOne();

  //     // await addLog(
  //     //   req.conn,
  //     //   req.moduleName,
  //     //   `${user.names} ${user.lastnames}`,
  //     //   user.id,
  //     //   `Se cambio la cuenta contable: ${account.id}. para el cliente ${user.id}`,
  //     // );

  //     return {
  //       message: 'La integración ha sido actualizada correctamente.',
  //     };
  //   } catch (error) {
  //     // return error
  //     throw new InternalServerErrorException(
  //       'Error al actualizar la integración. Contacta con tu administrador.',
  //     );
  //   }
  // }
}
