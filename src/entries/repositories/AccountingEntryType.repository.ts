import { EntityRepository, Repository } from 'typeorm';
import { AccountingEntryType } from '../entities/AccountingEntryType.entity';

@EntityRepository(AccountingEntryType)
export class AccountingEntryTypeRepository extends Repository<AccountingEntryType> {}
