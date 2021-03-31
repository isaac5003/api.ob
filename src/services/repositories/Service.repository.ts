import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { ServiceFilterDTO } from '../dtos/service-filter.dto';
import { Service } from '../entities/Service.entity';

@EntityRepository(Service)
export class ServiceRepository extends Repository<Service> {
  async getServices(company, filterDto: ServiceFilterDTO): Promise<Service[]> {
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

  async getService(id): Promise<Service> {
    let service: Service;
    try {
      service = await this.createQueryBuilder('s')
        .where({ id })
        .leftJoinAndSelect('s.sellingType', 'st')
        .getOne();
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al obtener el servicio seleccionado.',
      );
    }
    if (!service) {
      throw new BadRequestException('El servicio seleccionado no existe.');
    }
    return service;
  }
}
