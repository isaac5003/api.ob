import { EntityRepository, Repository } from 'typeorm';
import { AccountingEntry } from './AccountingEntry.entity';

@EntityRepository(AccountingEntry)
export class AccountingEntryRepository extends Repository<AccountingEntry> {}
