import { Company } from 'src/companies/entities/Company.entity';
import { ResponseSingleDTO } from 'src/_dtos/responseList.dto';
import { logDatabaseError } from 'src/_tools';
import { EntityRepository, Repository } from 'typeorm';
import { SettingGeneralDTO } from '../dtos/entries-setting-general.dto';
import { SettingSignaturesDTO } from '../dtos/entries-setting-signatures.dto';
import { AccountingSetting } from '../entities/AccountingSetting.entity';

@EntityRepository(AccountingSetting)
export class AccountingSettingRepository extends Repository<AccountingSetting> {
  async getSetting(
    company: Company,
    settingType: string,
  ): Promise<AccountingSetting> {
    let settings: AccountingSetting;
    try {
      settings = await this.findOneOrFail({ company });
    } catch (error) {
      logDatabaseError(settingType, error);
    }
    return settings;
  }

  async updateSetting(
    company: Company,
    data: SettingGeneralDTO | SettingSignaturesDTO,
    settingType: string,
  ): Promise<any> {
    try {
      const general = this.update({ company }, data);
      return general;
    } catch (error) {
      logDatabaseError(settingType, error);
    }
  }
}
