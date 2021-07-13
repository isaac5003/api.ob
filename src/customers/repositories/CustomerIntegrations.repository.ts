import { Company } from '../../companies/entities/Company.entity';
import { logDatabaseError } from '../../_tools';
import { EntityRepository, Repository } from 'typeorm';
import { AccountignCatalogIntegrationDTO } from '../dtos/customer-integration.dto';
import { CustomerIntegrations } from '../entities/CustomerIntegrations.entity';

const reponame = 'configuraciones de integracion';
@EntityRepository(CustomerIntegrations)
export class CustomerIntegrationsRepository extends Repository<CustomerIntegrations> {
  async getCustomerIntegrations(company: Company): Promise<CustomerIntegrations[]> {
    let settingIntegrations: CustomerIntegrations[];
    const leftJoinAndSelect = {
      com: 'ci.company',
      module: 'ci.module',
    };

    try {
      settingIntegrations = await this.find({
        where: { company },
        join: {
          alias: 'ci',
          leftJoinAndSelect,
        },
      });
    } catch (error) {
      console.error(error);
      logDatabaseError(reponame, error);
    }
    return settingIntegrations;
  }
  async createCustomerIntegrations(data: any): Promise<CustomerIntegrations> {
    // crea sucursal
    let response: CustomerIntegrations;
    try {
      response = await this.save(data);
    } catch (error) {
      logDatabaseError(reponame, error);
    }
    return await response;
  }
}
