import { logDatabaseError } from 'src/_tools';
import { EntityRepository, Repository } from 'typeorm';
import { CustomerTypeNatural } from '../entities/CustomerTypeNatural.entity';

const reponame = 'tipo de persona natural';
@EntityRepository(CustomerTypeNatural)
export class CustomerTypeNaturalRepository extends Repository<CustomerTypeNatural> {
  async getCustomerTypeNaturals(): Promise<CustomerTypeNatural[]> {
    let typeNaturals: CustomerTypeNatural[];
    try {
      typeNaturals = await this.find();
    } catch (error) {
      logDatabaseError(reponame, error);
    }
    return typeNaturals;
  }
}
