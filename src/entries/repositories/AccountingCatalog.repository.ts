import { Company } from 'src/companies/entities/Company.entity';
import { CustomerIntegrationDTO } from 'src/customers/dtos/customer-integration.dto';
import { logDatabaseError } from 'src/_tools';
import { EntityRepository, Repository } from 'typeorm';
import { AccountingCatalog } from '../entities/AccountingCatalog.entity';

const reponame = 'catalogo de cuentas';
@EntityRepository(AccountingCatalog)
export class AccountingCatalogRepository extends Repository<AccountingCatalog> {
  async getAccountingCatalogById(
    id: CustomerIntegrationDTO,
    company: Company,
  ): Promise<AccountingCatalog> {
    let account: AccountingCatalog;
    try {
      const { accountingCatalog } = id;
      account = await this.findOne({
        where: { id: accountingCatalog, company },
      });
    } catch (error) {
      logDatabaseError(reponame, error);
    }
    return account;
  }
}
