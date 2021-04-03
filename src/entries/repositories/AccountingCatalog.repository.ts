import { BadRequestException } from '@nestjs/common';
import { Company } from 'src/companies/entities/Company.entity';
import { CustomerIntegrationDTO } from 'src/customers/dtos/customer-integration.dto';
import { logDatabaseError } from 'src/_tools';
import { EntityRepository, Repository } from 'typeorm';
import { AccountingCatalog } from '../entities/AccountingCatalog.entity';

const reponame = 'catalogo de cuentas';
@EntityRepository(AccountingCatalog)
export class AccountingCatalogRepository extends Repository<AccountingCatalog> {
  async getAccountingCatalog(
    { accountingCatalog }: CustomerIntegrationDTO,
    company: Company,
  ): Promise<AccountingCatalog> {
    let account: AccountingCatalog;
    try {
      account = await this.findOneOrFail({
        where: { id: accountingCatalog, company },
      });
    } catch (error) {
      logDatabaseError(reponame, error);
    }

    return account;
  }

  async getAccountingCatalogNotUsed(
    data: CustomerIntegrationDTO,
    company: Company,
  ): Promise<AccountingCatalog> {
    const account = await this.getAccountingCatalog(data, company);
    if (account.isParent) {
      throw new BadRequestException(
        "La 'cuenta contable' selecciona no puede ser utilizada ya que no es asignable.",
      );
    }
    return account;
  }
}
