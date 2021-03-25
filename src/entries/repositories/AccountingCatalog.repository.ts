import { EntityRepository, Repository } from 'typeorm';
import { AccountingCatalog } from '../entities/AccountingCatalog.entity';

@EntityRepository(AccountingCatalog)
export class AccountingCatalogRepository extends Repository<AccountingCatalog> {}
