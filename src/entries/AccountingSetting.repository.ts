import { EntityRepository, Repository } from 'typeorm';
import { AccountingSetting } from './AccountingSetting.entity';

@EntityRepository(AccountingSetting)
export class AccountingSettingRepository extends Repository<AccountingSetting> {}
