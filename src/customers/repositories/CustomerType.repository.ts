import { logDatabaseError } from '../../_tools';
import { EntityRepository, Repository } from 'typeorm';
import { CustomerType } from '../entities/CustomerType.entity';

const reponame = 'tipo de cliente';
@EntityRepository(CustomerType)
export class CustomerTypeRepository extends Repository<CustomerType> {
  async getCustomerTypes(): Promise<CustomerType[]> {
    let types: CustomerType[];
    try {
      types = await this.find();
    } catch (error) {
      logDatabaseError(reponame, error);
    }
    return types;
  }
}
