import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CustomerValidateDTO } from '../dtos/customer-validator.dto';
import { CustomerFilterDTO } from '../dtos/customer-filter.dto';
import { Customer } from '../entities/Customer.entity';
import { CustomerValidateStatusDTO } from '../dtos/status-validator-dto';

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
        .leftJoinAndSelect('customer.accountingCatalog', 'ac')
        .getOne();
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al obtener el cliente seleccionado.',
      );
    }

    if (!customer) {
      throw new NotFoundException('El cliente seleccionado no existe.');
    }

    return customer;
  }

  async createCustomer(
    validatorCustomerDTO: CustomerValidateDTO,
  ): Promise<{ message: string; id: string }> {
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
      //TODO
      // const user = await req.conn
      // .getRepository('User')
      // .createQueryBuilder('u')
      // .where('u.id = :id', { id: req.user.uid })
      // .getOne();

      // crea sucursal
      try {
        // obtiene los campos requeridos
        const {
          contactName,
          contactInfo,
          address1,
          address2,
          country,
          state,
          city,
        } = validatorCustomerDTO.branch;

        await this.createQueryBuilder()
          .insert()
          .into('CustomerBranch')
          .values({
            name: 'Sucursal Principal',
            contactName,
            contactInfo,
            address1,
            address2,
            customer: customer.raw[0].id,
            country,
            state,
            city,
          })
          .execute();

        //TODO
        // await addLog(
        //   req.conn,
        //   req.moduleName,
        //   `${user.names} ${user.lastnames}`,
        //   user.id,
        //   `Se ha creado la sucursal: Sucursal Principal`,
        // );

        return {
          message: 'Se ha creado el cliente correctamente.',
          id: customer.raw[0].id,
        };
      } catch (error) {
        // on error
        throw new InternalServerErrorException(
          'Error al crear la sucursal del cliente. Contacta con tu administrador.',
        );
      }
    } catch (error) {
      // on error
      console.error(error);
      throw new InternalServerErrorException(
        'Error al crear el cliente. Contacta con tu administrador',
      );
    }
  }

  async updateCustomer(
    id: string,
    validatorCustomerDTO: CustomerValidateDTO,
  ): Promise<{ message: string }> {
    await this.getCustomerById(id);

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

      await this.createQueryBuilder()
        .update('Customer')
        .set({
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
        })
        .where('id = :id', { id })
        .execute();

      //TODO
      // const user = await req.conn
      // .getRepository('User')
      // .createQueryBuilder('u')
      // .where('u.id = :id', { id: req.user.uid })
      // .getOne();

      // crea sucursal
      try {
        // obtiene los campos requeridos
        const {
          contactName,
          contactInfo,
          address1,
          address2,
          country,
          state,
          city,
        } = validatorCustomerDTO.branch;

        await this.createQueryBuilder()
          .update('CustomerBranch')
          .set({
            contactName,
            contactInfo,
            address1,
            address2,
            country,
            state,
            city,
          })
          .where('id = :id', { id })
          .execute();

        //TODO
        // await addLog(
        //   req.conn,
        //   req.moduleName,
        //   `${user.names} ${user.lastnames}`,
        //   user.id,
        //   `Se ha creado la sucursal: Sucursal Principal`,
        // );

        return {
          message: 'Se ha actualizado el cliente correctamente.',
        };
      } catch (error) {
        // on error
        throw new InternalServerErrorException(
          'Error al actualizar la sucursal del cliente. Contacta con tu administrador.',
        );
      }
    } catch (error) {
      // on error
      console.error(error);
      throw new InternalServerErrorException(
        'Error al actualizar el cliente. Contacta con tu administrador',
      );
    }
  }

  // async deleteCustomer(id: string): Promise<{ message: string }> {
  //   // If no references deletes
  //   try {
  //     await this.createQueryBuilder()
  //       .delete()
  //       .from('Customer')
  //       .where('id = :id', { id })
  //       // .andWhere('company = :company', { company: req.user.cid })
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
  //     //   `Se elimino el cliente con nombre: ${customer.name}.`,
  //     // );

  //     return {
  //       message: 'El cliente ha sido eliminado correctamente.',
  //     };
  //   } catch (error) {
  //     console.error(error);
  //     // on error
  //     console.error(error);
  //     throw new InternalServerErrorException(
  //       'Error al eliminar el cliente. Contacta con tu administrador',
  //     );
  //   }
  // }

  async updateCustomerStatus(
    id: string,
    validatorCustomerStatusDTO: CustomerValidateStatusDTO,
  ): Promise<{ message: string }> {
    const { status } = validatorCustomerStatusDTO;

    await this.getCustomerById(id);
    // If customer exist updates it
    try {
      // return success
      await this.createQueryBuilder()
        .update('Customer')
        .set({ isActiveCustomer: status })
        //TODO
        // .where('company = :company', { company: req.user.cid })
        .where('id = :id', { id })
        .execute();

      //TODO
      // const user = await req.conn
      //   .getRepository('User')
      //   .createQueryBuilder('u')
      //   .where('u.id = :id', { id: req.user.uid })
      //   .getOne();

      // await addLog(
      //   req.conn,
      //   req.moduleName,
      //   `${user.names} ${user.lastnames}`,
      //   user.id,
      //   `Se cambio el estado del cliente: ${customer.name} a ${
      //     status ? 'ACTIVO' : 'INACTIVO'
      //   }.`,
      // );

      return {
        message: 'El estado del cliente ha sido actualizado correctamente.',
      };
    } catch (error) {
      // return error
      throw new InternalServerErrorException(
        'Error al actualizar el estado del cliente. Contacta con tu administrador.',
      );
    }
  }

  async getCustomerIntegration(
    id: string,
  ): Promise<{ integrations: any | null }> {
    const customer = await this.getCustomerById(id);
    try {
      return {
        integrations: {
          catalog: customer.accountingCatalog
            ? customer.accountingCatalog.id
            : null,
        },
      };
    } catch (error) {
      // return error
      throw new InternalServerErrorException(
        'Error al obtener la configuracion de integración del cliente. Contacta con tu administrador.',
      );
    }
  }

  async updateCustomerIntegration(
    id: string,
    account: any | null,
  ): Promise<{ message: string }> {
    await this.getCustomerById(id);
    //validate that account can be use
    if (account.isParent) {
      throw new BadRequestException(
        'La cuenta selecciona no puede ser utilizada ya que no es asignable',
      );
    }

    // If account exist updates intergations it
    try {
      // return success
      await this.createQueryBuilder()
        .update('Customer')
        .set({ accountingCatalog: account.id })
        .where('id = :id', { id })
        .execute();

      // const user = await req.conn
      //   .getRepository('User')
      //   .createQueryBuilder('u')
      //   .where('u.id = :id', { id: req.user.uid })
      //   .getOne();

      // await addLog(
      //   req.conn,
      //   req.moduleName,
      //   `${user.names} ${user.lastnames}`,
      //   user.id,
      //   `Se cambio la cuenta contable: ${account.id}. para el cliente ${user.id}`,
      // );

      return {
        message: 'La integración ha sido actualizada correctamente.',
      };
    } catch (error) {
      // return error
      throw new InternalServerErrorException(
        'Error al actualizar la integración. Contacta con tu administrador.',
      );
    }
  }
}
