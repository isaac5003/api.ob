import { Company } from '../../companies/entities/Company.entity';
import { logDatabaseError } from '../../_tools';
import { EntityRepository, Repository } from 'typeorm';
import { SettingGeneralDTO } from '../dtos/settings/entries-setting-general.vdto';
import { SettingSignaturesDTO } from '../dtos/settings/entries-setting-signatures.vdto';
import { AccountingSetting } from '../entities/AccountingSetting.entity';

@EntityRepository(AccountingSetting)
export class AccountingSettingRepository extends Repository<AccountingSetting> {
  async getSetting(company: Company, settingType: string): Promise<any> {
    let settings: AccountingSetting;
    const leftJoinAndSelect = {
      adc: 's.accountingDebitCatalog',
      acc: 's.accountingCreditCatalog',
    };
    try {
      settings = await this.findOne({
        where: { company },
        join: {
          alias: 's',
          leftJoinAndSelect,
        },
      });
    } catch (error) {
      console.error(error);

      logDatabaseError(settingType, error);
    }
    return settings;
  }

  async updateSetting(
    company: Company,
    data: SettingGeneralDTO | SettingSignaturesDTO | any,
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
      console.error(error);

      logDatabaseError(settingType, error);
    }

    return response;
  }
}
