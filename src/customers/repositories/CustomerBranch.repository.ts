import { logDatabaseError } from '../../_tools';
import { EntityRepository, Repository } from 'typeorm';
import { BranchDataDTO } from '../dtos/customer-branch.dto';
import { CustomerBranch } from '../entities/CustomerBranch.entity';
import { FilterDTO } from 'src/_dtos/filter.dto';

@EntityRepository(CustomerBranch)
export class CustomerBranchRepository extends Repository<CustomerBranch> {
  async getCustomerBranches(
    id: string,
    type: string,
    filter: FilterDTO,
  ): Promise<{ data: CustomerBranch[]; count: number }> {
    try {
      const { limit, page, search, order, prop } = filter;

      const query = this.createQueryBuilder('branch')
        .leftJoinAndSelect('branch.country', 'bc')
        .leftJoinAndSelect('branch.state', 'bs')
        .leftJoinAndSelect('branch.city', 'bct')
        .where('branch.customer=:id', { id: id });

      if (search) {
        query.andWhere('(LOWER(branch.name) LIKE :search OR LOWER(branch.contactName) LIKE :search)', {
          search: `%${search}%`,
        });
      }

      const count = await query.getCount();
      if (limit && page) {
        query.take(limit).skip(limit ? (page ? page - 1 : 0) * limit : null);
      }

      if (order && prop) {
        let field = `branch.${prop}`;
        switch (prop) {
          case 'country':
            field = `bc.id`;
            break;
          case 'state':
            field = `bs.id`;
            break;
          case 'city':
            field = `bct.id`;
            break;
        }
        query.orderBy(field, order == 'ascending' ? 'ASC' : 'DESC');
      } else {
        query.orderBy('branch.createdAt', 'DESC');
      }

      return { data: await query.getMany(), count };
    } catch (error) {
      console.error(error);

      logDatabaseError(`sucursal del ${type}`, error);
    }
  }

  async createBranch(data: BranchDataDTO[], type: string): Promise<CustomerBranch[]> {
    // crea sucursal
    let response: CustomerBranch[];
    try {
      const branch = this.create([...data]);
      response = await this.save(branch);
    } catch (error) {
      console.error(error);

      logDatabaseError(type, error);
    }
    return await response;
  }

  async updateBranch(id: string, data: Partial<BranchDataDTO>, type): Promise<any> {
    try {
      return this.update({ id }, data);
    } catch (error) {
      console.error(error);
      logDatabaseError(type, error);
    }
  }

  async deleteBranch(id: string, type: string): Promise<any> {
    try {
      return await this.delete({ id });
    } catch (error) {
      console.error(error);
      logDatabaseError(type, error);
    }
  }

  async getCustomerCustomerBranch(id: string, type: string, customerId: string): Promise<CustomerBranch> {
    let customerBranch: CustomerBranch;
    const leftJoinAndSelect = {
      c: 'cb.country',
      s: 'cb.state',
      ct: 'cb.city',
    };

    try {
      customerBranch = await this.findOneOrFail({
        where: { id: id, customer: customerId },
        join: {
          alias: 'cb',
          leftJoinAndSelect,
        },
      });
    } catch (error) {
      console.error(error);
      logDatabaseError(`sucursal del ${type}`, error);
    }
    return customerBranch;
  }
}
