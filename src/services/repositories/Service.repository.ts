import { Company } from '../../companies/entities/Company.entity';
import { EntityRepository, Repository } from 'typeorm';
import { serviceDataDTO } from '../dtos/service-data.dto';
import { ServiceFilterDTO } from '../dtos/service-filter.dto';
import { Service } from '../entities/Service.entity';
import { logDatabaseError } from '../../_tools/index';
import { serviceStatusDTO } from '../dtos/service-status.dto';
import { ServiceIntegrationDTO } from '../dtos/service-integration.dto';
import { ServicesIdsDTO } from '../dtos/delete-updateServices/service-deleteupdate.dto';
import { UpdateStatusDTO } from '../dtos/delete-updateServices/service-update-status.dto';
import { paginate } from 'nestjs-typeorm-paginate';

const reponame = 'servicio';
@EntityRepository(Service)
export class ServiceRepository extends Repository<Service> {
  async getServicesByIds(company: Company, ids: string[]): Promise<Service[]> {
    try {
      const services = await this.findByIds(ids as unknown as any[]);

      return services;
    } catch (error) {
      console.error(error);

      logDatabaseError(reponame, error);
    }
  }

  async getFilteredServices(company: Company, filter?: ServiceFilterDTO): Promise<{ data: Service[]; count: number }> {
    const { limit, page, search, active, prop, order, type, fromAmount, toAmount } = filter;

    try {
      const query = this.createQueryBuilder('s').where({ company }).leftJoinAndSelect('s.sellingType', 'st');

      // filter by search value
      if (search) {
        query.andWhere('LOWER(s.name) LIKE :search OR LOWER(s.description) LIKE :search', {
          search: `%${search}%`,
        });
      }

      // filter by status
      if (active == true || active == false) {
        query.andWhere('s.active = :active', { active });
      }

      // filter by range of amounts
      if (fromAmount && toAmount) {
        query.andWhere('s.cost >= :fromAmount', { fromAmount });
        query.andWhere('s.cost <= :toAmount', { toAmount });
      }

      // filter by type
      if (type) {
        query.andWhere('s.sellingType = :type', { type });
      }

      const queryc = await query.getCount();

      // sort by prop}
      if (order && prop) {
        query.orderBy(`s.${prop}`, order == 'ascending' ? 'ASC' : 'DESC');
      } else {
        query.orderBy('s.createdAt', 'DESC');
      }

      const data = await paginate<Service>(query, { limit: limit ? limit : null, page: page ? page : null });
      return {
        data: data.items,
        count: queryc,
      };
    } catch (error) {
      logDatabaseError(reponame, error);
    }
  }

  async getService(company: Company, id: string, joins: string[] = []): Promise<Service> {
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

  async createService(company: Company, data: serviceDataDTO): Promise<Service> {
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

  async updateServicesStatus(company: Company, data: UpdateStatusDTO): Promise<any> {
    try {
      const service = await this.update(data.ids, data);
      return service;
    } catch (error) {
      console.error(error);

      logDatabaseError(reponame, error);
    }
  }

  async deleteServices(company: Company, id: ServicesIdsDTO): Promise<any> {
    const services = await this.getServicesByIds(company, id as unknown as string[]);
    let deletedServices;
    try {
      deletedServices = await this.delete(id as unknown as any[]);
    } catch (error) {
      console.error(error);

      logDatabaseError(reponame, error);
    }

    return {
      services: services.map((s) => {
        return { id: s.id };
      }),
      deletedServices,
    };
  }

  async deleteService(company: Company, id: string): Promise<boolean> {
    const service = await this.getService(company, id);
    try {
      await this.delete(service.id);
    } catch (error) {
      logDatabaseError(reponame, error);
    }
    return true;
  }
}
