import { Company } from 'src/companies/entities/Company.entity';
import { logDatabaseError } from 'src/_tools';
import { EntityRepository, Repository } from 'typeorm';
import { AccountignCatalogIntegrationDTO } from '../dtos/customer-integration.dto';
import { CustomerSetting } from '../entities/CustomerSetting.entity';

const reponame = 'configuraciones de integracion';
@EntityRepository(CustomerSetting)
export class CustomerSettingRepository extends Repository<CustomerSetting> {
  async getCustomerSettingIntegrations(
    company: Company,
  ): Promise<CustomerSetting> {
    let settingIntegrations: CustomerSetting;
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
  async createSettingIntegration(
    company: Company,
    data: AccountignCatalogIntegrationDTO,
  ): Promise<CustomerSetting> {
    // crea sucursal
    let response: CustomerSetting;
    try {
      const settings = this.create({ company, ...data });
      response = await this.save(settings);
    } catch (error) {
      logDatabaseError(reponame, error);
    }
    return await response;
  }

  async updateCustomerSetting(
    company: Company,
    data: AccountignCatalogIntegrationDTO,
  ): Promise<void> {
    try {
      this.update({ company }, data);
    } catch (error) {
      logDatabaseError(reponame, error);
    }
  }
}
