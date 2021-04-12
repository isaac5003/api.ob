import { Company } from 'src/companies/entities/Company.entity';
import { logDatabaseError } from 'src/_tools';
import { EntityRepository, Repository } from 'typeorm';
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

  async updateSettings(company: Company): Promise<void> {}
}
