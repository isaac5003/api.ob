import { Company } from 'src/companies/entities/Company.entity';
import { EntityRepository, Repository } from 'typeorm';
import { serviceDataDTO } from '../dtos/service-data.dto';
import { ServiceFilterDTO } from '../dtos/service-filter.dto';
import { Service } from '../entities/Service.entity';
import { logDatabaseError } from '../../_tools/index';
import { serviceStatusDTO } from '../dtos/service-status.dto';
import { ServiceIntegrationDTO } from '../dtos/service-integration.dto';

const reponame = 'servicio';
@EntityRepository(Service)
export class ServiceRepository extends Repository<Service> {
  async getServices(
    company: Company,
    filter: ServiceFilterDTO,
  ): Promise<Service[]> {
    const {
      limit,
      page,
      search,
      active,
      prop,
      order,
      type,
      fromAmount,
      toAmount,
    } = filter;

    try {
      const query = this.createQueryBuilder('s').where({ company });

      // filter by search value
      if (search) {
        query.andWhere(
          'LOWER(s.name) LIKE :search OR LOWER(s.description) LIKE :search',
          {
            search: `%${search}%`,
          },
        );
      }

      // filter by status
      if (active) {
        query.andWhere('s.active = :active', { active });
      }

      // filter by range of amounts
      if (fromAmount && toAmount) {
        query.andWhere('s.cost >= :fromAmount', { fromAmount });
        query.andWhere('s.cost >= :toAmount', { toAmount });
      }

      // applies pagination
      if (limit && page) {
        query.take(limit).skip(limit ? (page ? page - 1 : 0 * limit) : null);
      }

      // filter by type
      if (type) {
        query.andWhere('s.sellingType = :type', { type });
      }

      // sort by prop}
      if (order && prop) {
        query.orderBy(`s.${prop}`, order == 'ascending' ? 'ASC' : 'DESC');
      } else {
        query.orderBy('s.createdAt', 'DESC');
      }

      return await query.getMany();
    } catch (error) {
      logDatabaseError(reponame, error);
    }
  }

  async getService(
    company: Company,
    id: string,
    joins: string[] = [],
  ): Promise<Service> {
    let service: Service;

    const leftJoinAndSelect = {
      st: 's.sellingType',
    };

    for (const table of joins) {
      switch (table) {
        case 'ac':
          leftJoinAndSelect['ac'] = 's.accountingCatalog';
          break;
      }
    }

    try {
      service = await this.findOneOrFail(
        { id, company },
        {
          join: {
            alias: 's',
            leftJoinAndSelect,
          },
        },
      );
    } catch (error) {
      console.error(error);

      logDatabaseError(reponame, error);
    }
    return service;
  }

  async createService(
    company: Company,
    data: serviceDataDTO,
  ): Promise<Service> {
    let response: Service;
    try {
      const service = this.create({ company, ...data });
      response = await this.save(service);
    } catch (error) {
      logDatabaseError(reponame, error);
    }
    return await response;
  }

  async updateService(
    company: Company,
    data: serviceDataDTO | serviceStatusDTO | ServiceIntegrationDTO,
    id: string,
  ): Promise<any> {
    try {
      const service = await this.update({ id, company }, data);
      return service;
    } catch (error) {
      logDatabaseError(reponame, error);
    }
  }

  async deleteService(company: Company, id: string): Promise<boolean> {
    const service = await this.getService(company, id);
    try {
      await this.delete(service);
    } catch (error) {
      logDatabaseError(reponame, error);
    }
    return true;
  }
}
