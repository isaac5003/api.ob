import { InternalServerErrorException } from '@nestjs/common';
import { logDatabaseError } from 'src/_tools';
import { EntityRepository, Repository } from 'typeorm';
import { Company } from '../entities/Company.entity';

@EntityRepository(Company)
export class CompanyRepository extends Repository<Company> {
  async GetAuthDataById(id: string): Promise<Company> {
    try {
      const company = await this.createQueryBuilder('c').where({ id }).getOne();
      return company;
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener la empresa seleccionada.');
    }
  }

  async getCompanyById(id: string): Promise<Company> {
    try {
      const company = await this.createQueryBuilder('c').where({ id }).leftJoinAndSelect('c.branches', 'b').getOne();
      return company;
    } catch (error) {
      logDatabaseError('company', error);
    }
  }
}
