import { EntityRepository, Repository } from 'typeorm';
import { AccountingEntryDetail } from './AccountingEntryDetail.entity';

@EntityRepository(AccountingEntryDetail)
export class AccountingEntryDetailRepository extends Repository<AccountingEntryDetail> {}
