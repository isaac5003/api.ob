import { EntityRepository, Repository } from 'typeorm';
import { AccountingEntryType } from './AccountingEntryType.entity';

@EntityRepository(AccountingEntryType)
export class AccountingEntryTypeRepository extends Repository<AccountingEntryType> {}
