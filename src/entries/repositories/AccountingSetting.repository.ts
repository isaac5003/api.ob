import { Company } from 'src/companies/entities/Company.entity';
import { ResponseSingleDTO } from 'src/_dtos/responseList.dto';
import { logDatabaseError } from 'src/_tools';
import { EntityRepository, Repository } from 'typeorm';
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
}
