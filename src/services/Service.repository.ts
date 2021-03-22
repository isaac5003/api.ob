import { BadRequestException, NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { ServiceFilterDTO } from './dtos/service-filter.dto';
import { Service } from './Service.entity';

@EntityRepository(Service)
export class ServiceRepository extends Repository<Service> {
  async getServices(filterDto: ServiceFilterDTO): Promise<Service[]> {
    const {
      active,
      limit,
      page,
      search,
      order,
      prop,
      type,
      fromAmount,
      toAmount,
    } = filterDto;
    const query = this.createQueryBuilder('service').leftJoinAndSelect(
      'service.sellingType',
      'sellingType',
    );

    if (active) {
      query.andWhere('service.active = :active', { active });
    }

    if (search) {
      query.andWhere(
        '(LOWER(service.name) LIKE :search OR LOWER(service.description) LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (type) {
      query.andWhere('service.sellingType = :type', { type });
    }

    if (limit && page) {
      query.take(limit).skip(limit ? (page ? page - 1 : 0) * limit : null);
    }

    if (order && prop) {
      query.orderBy(`service.${prop}`, order == 'ascending' ? 'ASC' : 'DESC');
    } else {
      query.orderBy('service.createdAt', 'DESC');
    }

    if (fromAmount && toAmount) {
      query.andWhere('service.cost >= :fromAmount', { fromAmount });
      query.andWhere('service.cost <= :toAmount', { toAmount });
    }

    return await query.getMany();
  }

  async getService(id: string): Promise<Service> {
    let service: Service;
    try {
      service = await this.createQueryBuilder('service')
        .leftJoinAndSelect('service.sellingType', 'sellingType')
        .where('service.id = :id', { id })
        .getOne();
    } catch (error) {
      throw new BadRequestException(
        'Error al obtener el servicio seleccionado.',
      );
    }

    if (!service) {
      throw new NotFoundException('El servicio seleccionado no existe.');
    }

    return service;
  }
}
