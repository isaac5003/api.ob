import { Company } from 'src/companies/entities/Company.entity';
import { logDatabaseError } from 'src/_tools';
import { EntityRepository, Repository } from 'typeorm';
import { ServiceIntegrationDTO } from '../dtos/service-integration.dto';
import { ServiceSetting } from '../entities/ServiceSetting.entity';

const reponame = 'configuracioón de servicio';
@EntityRepository(ServiceSetting)
export class ServiceSettingRepository extends Repository<ServiceSetting> {
  async getSettings(company: Company): Promise<ServiceSetting> {
    try {
      const servicesSetting = await this.findOne({
        where: { company },
        join: {
          alias: 'ss',
          leftJoinAndSelect: { ac: 'ss.accountingCatalog' },
        },
      });
      return servicesSetting;
    } catch (error) {
      logDatabaseError(reponame, error);
    }
  }

  async updateSettings(
    company: Company,
    data: ServiceIntegrationDTO,
  ): Promise<void> {
    try {
      this.update({ company }, data);
    } catch (error) {
      logDatabaseError(reponame, error);
    }
  }

  async createSettings(
    company: Company,
    data: ServiceIntegrationDTO,
  ): Promise<ServiceSetting> {
    let response: ServiceSetting;
    try {
      const settings = this.create({ company, ...data });
      response = await this.save(settings);
    } catch (error) {
      logDatabaseError(reponame, error);
    }
    return response;
  }
}
