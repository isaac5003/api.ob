import { InternalServerErrorException } from '@nestjs/common';
import { Branch } from 'src/companies/entities/Branch.entity';
import { EntityRepository, Repository } from 'typeorm';
import { BranchAddDTO } from '../dtos/branch-add.dto';
import { CustomerBranch } from '../entities/CustomerBranch.entity';

@EntityRepository(CustomerBranch)
export class CustomerBranchRepository extends Repository<CustomerBranch> {
  async createBranch(
    id: string,
    validatorBranchDTO: BranchAddDTO,
  ): Promise<{ message: string }> {
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
      } = validatorBranchDTO;

      await this.createQueryBuilder()
        .insert()
        .into('CustomerBranch')
        .values({
          name: 'Sucursal Principal',
          contactName,
          contactInfo,
          address1,
          address2,
          customer: id,
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
        message: 'Se ha creado la sucursal del cliente correctamente.',
      };
    } catch (error) {
      // on error
      throw new InternalServerErrorException(
        'Error al crear la sucursal del cliente. Contacta con tu administrador.',
      );
    }
  }

  async updateBranch(
    id: string,
    validatorBranchDTO: BranchAddDTO,
  ): Promise<{ message: string }> {
    // actualiza sucursal
    try {
      await this.createQueryBuilder()
        .insert()
        .into('CustomerBranch')
        .values({
          name: 'Sucursal Principal',
          ...validatorBranchDTO,
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
        message: 'Se ha actualizado la sucursal del cliente correctamente.',
      };
    } catch (error) {
      // on error
      throw new InternalServerErrorException(
        'Error al actualizar la sucursal del cliente. Contacta con tu administrador.',
      );
    }
  }
}
