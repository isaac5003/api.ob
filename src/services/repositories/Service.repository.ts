import { EntityRepository, Repository } from 'typeorm';
import { ServiceFilterDTO } from '../dtos/service-filter.dto';
import { Service } from '../entities/Service.entity';

@EntityRepository(Service)
export class ServiceRepository extends Repository<Service> {
  async getServices(filterDto: ServiceFilterDTO): Promise<Service[]> {
    const {
      limit,
      page,
      search,
      prop,
      order,
      active,
      type,
      fromAmount,
      toAmount,
    } = filterDto;

    const query = this.createQueryBuilder('service');

    if (search) {
      query.andWhere(
        'LOWER(service.name) LIKE :search OR LOWER(service.description) LIKE :search',
        {
          search: `%${search}%`,
        },
      );
    }

    if (limit && page) {
      query.take(limit).skip(limit ? (page ? page - 1 : 0 * limit) : null);
    }

    return await query.getMany();
  }
}
