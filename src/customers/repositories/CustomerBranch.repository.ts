import { InternalServerErrorException } from '@nestjs/common';
import { Branch } from 'src/companies/entities/Branch.entity';
import { ResponseMinimalDTO } from 'src/_dtos/responseList.dto';
import { EntityRepository, Repository } from 'typeorm';
import { BranchAddDTO } from '../dtos/branch-add.dto';
import { Customer } from '../entities/Customer.entity';
import { CustomerBranch } from '../entities/CustomerBranch.entity';

@EntityRepository(CustomerBranch)
export class CustomerBranchRepository extends Repository<CustomerBranch> {
  async createBranch(
    id: string,
    validatorBranchDTO: BranchAddDTO,
  ): Promise<CustomerBranch> {
    // crea sucursal
    let response: CustomerBranch;
    try {
      const branch = this.create({ id, ...validatorBranchDTO });
      response = await this.save(branch);
    } catch (error) {
      // on error
      console.error(error);

      throw new InternalServerErrorException(
        'Error al crear la sucursal del cliente. Contacta con tu administrador.',
      );
    }
    return await response;
  }

  async updateBranch(id: string, updateDTO: BranchAddDTO): Promise<any> {
    return this.update({ id }, updateDTO);
  }
}
