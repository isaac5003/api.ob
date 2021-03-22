import { EntityRepository, Repository } from 'typeorm';
import { ServiceFilterDto } from './dtos/service-filter.dto';
import { Service } from './Service.entity';

@EntityRepository(Service)
export class ServiceRepository extends Repository<Service> {
  async getServices(filterDto: ServiceFilterDto): Promise<Service[]> {
    const { active, limit, page, search, order, prop } = filterDto;
    const query = this.createQueryBuilder('service');

    if (active) {
      query.andWhere('service.active = :active', { active });
    }

    if (search) {
      query.andWhere(
        '(LOWER(service.name) LIKE :search OR LOWER(service.description) LIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (limit && page) {
      query.take(limit).skip(limit ? (page ? page - 1 : 0) * limit : null);
    }

    if (order && prop) {
      query.orderBy(`service.${prop}`, order == 'ascending' ? 'ASC' : 'DESC');
    } else {
      query.orderBy('service.createdAt', 'DESC');
    }

    return await query.getMany();
  }
}
