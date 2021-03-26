import { EntityRepository, Repository } from 'typeorm';
import { AccountingEntry } from '../entities/AccountingEntry.entity';

@EntityRepository(AccountingEntry)
export class AccountingEntryRepository extends Repository<AccountingEntry> {}
