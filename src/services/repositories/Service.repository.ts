import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Company } from 'src/companies/entities/Company.entity';
import { EntityRepository, Repository } from 'typeorm';
import { serviceCreateDTO } from '../dtos/service-create.dto';
import { ServiceFilterDTO } from '../dtos/service-filter.dto';
import { Service } from '../entities/Service.entity';

@EntityRepository(Service)
export class ServiceRepository extends Repository<Service> {
  async getServices(
    company: Company,
    filterDto: ServiceFilterDTO,
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
    } = filterDto;

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
      throw new InternalServerErrorException(
        'Error al obtener el listado de servicios.',
      );
    }
  }

  async getService(company: Company, id: string): Promise<Service> {
    let service: Service;
    try {
      service = await this.findOne({ id, company });
    } catch (error) {
      throw new BadRequestException('despues lo busco');
    }

    if (!service) {
      throw new NotFoundException('no encontrado');
    }
    return service;
  }

  async createService(
    company: Company,
    createDTO: serviceCreateDTO,
  ): Promise<Service> {
    const newService = this.create({ company, ...createDTO });
    const response = await this.save(newService);
    console.log(response);
    return response;
  }

  // async updateService(company: string): Promise<Service> {}

  // async deleteService(company: string): Promise<Service> {}
}
