import { InternalServerErrorException } from '@nestjs/common';
import { Company } from 'src/companies/entities/Company.entity';
import { Module } from 'src/system/entities/Module.entity';
import { EntityRepository, Repository } from 'typeorm';
import { Access } from '../entities/Access.entity';

@EntityRepository(Access)
export class AccessRepository extends Repository<Access> {
  async getAccessByProfileId(profile): Promise<Access> {
    return this.createQueryBuilder('a')
      .leftJoinAndSelect('a.company', 'c')
      .leftJoinAndSelect('a.branch', 'b')
      .where('a.profile = :profile', { profile })
      .getOne();
  }

  async getCompaniesWithIntegrations(receiverModule: string, integratedModule: string): Promise<Company[]> {
    let companiesWithIntegrations;

    try {
      companiesWithIntegrations = await this.createQueryBuilder('c')
        .select(['c.id', 'co.id', 'co.name', 'co.shortName'])
        .leftJoin('c.company', 'co')
        .where('c.module =:module', { module: receiverModule })
        .andWhere('c.module=:module', { module: integratedModule })
        .andWhere('co.active =:active', { active: true })
        .getMany();
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener el listado de empresas.');
    }
    return companiesWithIntegrations.map((c) => c.company.id);
  }
}
