import { Company } from 'src/companies/entities/Company.entity';
import { logDatabaseError } from 'src/_tools';
import { EntityRepository, Repository } from 'typeorm';
import { SettingGeneralDTO } from '../dtos/settings/entries-setting-general.dto';
import { SettingIntegrationsDTO } from '../dtos/settings/entries-setting-integration.dto';
import { SettingSignaturesDTO } from '../dtos/settings/entries-setting-signatures.dto';
import { AccountingSetting } from '../entities/AccountingSetting.entity';

@EntityRepository(AccountingSetting)
export class AccountingSettingRepository extends Repository<AccountingSetting> {
  async getSetting(company: Company, settingType: string): Promise<any> {
    let settings: AccountingSetting;
    try {
      settings = await this.findOne({ company });
    } catch (error) {
      logDatabaseError(settingType, error);
    }
    return settings;
  }

  async updateSetting(
    company: Company,
    data: SettingGeneralDTO | SettingSignaturesDTO | SettingIntegrationsDTO | any,
    settingType: string,
    type: string,
    id?: string,
  ): Promise<any> {
    let response;
    try {
      let settings;
      switch (type) {
        case 'create':
          settings = this.create({ company, ...data });
          break;
        case 'update':
          settings = { company, id, ...data };
          break;
      }
      response = await this.save(settings);
    } catch (error) {
      logDatabaseError(settingType, error);
    }

    return response;
  }
}
