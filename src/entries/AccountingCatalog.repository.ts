import { EntityRepository, Repository } from 'typeorm';
import { AccountingCatalog } from './AccountingCatalog.entity';

@EntityRepository(AccountingCatalog)
export class AccountingCatalogRepository extends Repository<AccountingCatalog> {}
