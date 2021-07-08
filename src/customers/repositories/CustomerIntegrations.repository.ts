import { Company } from '../../companies/entities/Company.entity';
import { logDatabaseError } from '../../_tools';
import { EntityRepository, Repository } from 'typeorm';
import { AccountignCatalogIntegrationDTO } from '../dtos/customer-integration.dto';
import { CustomerIntegrations } from '../entities/CustomerIntegrations.entity';

const reponame = 'configuraciones de integracion';
@EntityRepository(CustomerIntegrations)
export class CustomerIntegrationsRepository extends Repository<CustomerIntegrations> {
  async getCustomerIntegrations(company: Company): Promise<CustomerIntegrations> {
    let settingIntegrations: CustomerIntegrations;
    const leftJoinAndSelect = {
      csi: 'cs.accountingCatalog',
    };

    try {
      settingIntegrations = await this.findOne(
        { company },
        {
          join: {
            alias: 'cs',
            leftJoinAndSelect,
          },
        },
      );
    } catch (error) {
      console.error(error);
      logDatabaseError(reponame, error);
    }
    return settingIntegrations;
  }
  async createCustomerIntegrations(
    company: Company,
    data: AccountignCatalogIntegrationDTO,
  ): Promise<CustomerIntegrations> {
    // crea sucursal
    let response: CustomerIntegrations;
    try {
      const settings = this.create({ company, ...data });
      response = await this.save(settings);
    } catch (error) {
      logDatabaseError(reponame, error);
    }
    return await response;
  }

  async updateCustomerIntegrations(company: Company, data: AccountignCatalogIntegrationDTO): Promise<void> {
    try {
      this.update({ company }, data);
    } catch (error) {
      logDatabaseError(reponame, error);
    }
  }
}
