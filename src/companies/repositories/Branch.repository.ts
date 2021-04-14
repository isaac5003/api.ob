import { InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { Branch } from '../entities/Branch.entity';

@EntityRepository(Branch)
export class BranchRepository extends Repository<Branch> {
  async getBranchById(id: string): Promise<Branch> {
    try {
      const branch = await this.createQueryBuilder('b').where({ id }).getOne();
      return branch;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al obtener la empresa seleccionada.',
      );
    }
  }
}
