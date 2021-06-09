import { logDatabaseError } from '../../_tools';
import { EntityRepository, Repository } from 'typeorm';
import { CustomerType } from '../entities/CustomerType.entity';

const reponame = 'tipo de cliente';
@EntityRepository(CustomerType)
export class CustomerTypeRepository extends Repository<CustomerType> {
  async getCustomerTypes(): Promise<{ data: CustomerType[]; count: number }> {
    let types: CustomerType[];
    try {
      types = await this.find();
    } catch (error) {
      logDatabaseError(reponame, error);
    }
    return {
      data: types,
      count: types.length,
    };
  }
}
