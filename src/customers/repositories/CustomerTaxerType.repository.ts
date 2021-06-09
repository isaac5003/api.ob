import { logDatabaseError } from '../../_tools';
import { EntityRepository, Repository } from 'typeorm';
import { CustomerTaxerType } from '../entities/CustomerTaxerType.entity';

const reponame = 'tipo de impuesto';
@EntityRepository(CustomerTaxerType)
export class CustomerTaxerTypeRepository extends Repository<CustomerTaxerType> {
  async getCustomerTaxerTypes(): Promise<{ data: CustomerTaxerType[]; count: number }> {
    let taxerTypes: CustomerTaxerType[];
    try {
      taxerTypes = await this.find();
    } catch (error) {
      logDatabaseError(reponame, error);
    }
    return { data: taxerTypes, count: taxerTypes.length };
  }
}
