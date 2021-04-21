import { BadRequestException } from '@nestjs/common';
import { Company } from 'src/companies/entities/Company.entity';
import { AccountignCatalogIntegrationDTO } from 'src/customers/dtos/customer-integration.dto';
import { FilterDTO } from 'src/_dtos/filter.dto';
import { ResponseMinimalDTO } from 'src/_dtos/responseList.dto';
import { logDatabaseError } from 'src/_tools';
import { EntityRepository, Repository } from 'typeorm';
import { AccountsDTO } from '../dtos/entries-account.dto';
import { AccountingCatalogDTO } from '../dtos/entries-accountignCatalog.dto';
import { AccountingCatalog } from '../entities/AccountingCatalog.entity';

const reponame = 'catalogo de cuentas';
@EntityRepository(AccountingCatalog)
export class AccountingCatalogRepository extends Repository<AccountingCatalog> {
  async getAccountingCatalogs(
    company: Company,
    filter: FilterDTO,
  ): Promise<AccountingCatalog[]> {
    try {
      const { search, limit, page } = filter;

      const query = this.createQueryBuilder('ac')
        .select([
          'ac.id',
          'ac.code',
          'ac.name',
          'ac.isAcreedora',
          'ac.isBalance',
          'ac.isParent',
          'ac.description',
          'sa.id',
          'pc.code',
          'pc.name',
        ])
        .where({ company })
        .leftJoin('ac.accountingCatalogs', 'sa')
        .leftJoin('ac.parentCatalog', 'pc')
        .orderBy('ac.code', 'ASC');

      if (search) {
        query.andWhere(
          '(LOWER(ac.name) LIKE :search) OR (LOWER(ac.code) LIKE :search) ',
          {
            search: `%${search}%`,
          },
        );
      }

      if (limit && page) {
        query.take(limit).skip(limit ? (page ? page - 1 : 0) * limit : null);
      }
      return await query.getMany();
    } catch (error) {
      console.error(error);

      logDatabaseError(reponame, error);
    }
  }

  async getAccountingCatalogsReport(company): Promise<AccountingCatalog[]> {
    let catalog: AccountingCatalog[];
    try {
      catalog = await this.find({ company });
    } catch (error) {
      console.error(error);

      logDatabaseError(reponame, error);
    }
    return catalog;
  }

  async getAccountingCatalog(
    id: string,
    company: Company,
    join: boolean,
  ): Promise<AccountingCatalog> {
    let account: AccountingCatalog;
    const leftJoinAndSelect = {};

    try {
      if (join) {
        leftJoinAndSelect['sa'] = 'ac.accountingCatalogs';
      }
      account = await this.findOneOrFail({
        where: { id, company },
        join: {
          alias: 'ac',
          leftJoinAndSelect,
        },
      });
    } catch (error) {
      console.error(error);

      logDatabaseError(reponame, error);
    }

    return account;
  }

  async getAccountingCatalogNotUsed(
    accountingCatalog: any,
    company: Company,
  ): Promise<AccountingCatalog> {
    console.log(accountingCatalog);

    const account = await this.getAccountingCatalog(
      accountingCatalog as string,
      company,
      true,
    );
    if (account.isParent) {
      throw new BadRequestException(
        "La 'cuenta contable' selecciona no puede ser utilizada ya que no es asignable.",
      );
    }
    return account;
  }

  async createAccounts(
    data: any,
    company: Company,
  ): Promise<AccountingCatalog[]> {
    let response;
    try {
      const insert = data.accounts.map((d) => {
        return {
          ...d,
          company: company,
          parentCatalog: data.parentCatalog,
        };
      });
      const accounts = this.create(insert);
      response = await this.save(accounts);
    } catch (error) {
      console.error(error);
      logDatabaseError(reponame, error);
    }

    return await response;
  }

  async updateAccount(id: string, data: any, company: Company): Promise<any> {
    try {
      const accountingCatalog = id;
      const account = this.update({ id, company }, data);
      return account;
    } catch (error) {
      logDatabaseError(reponame, error);
    }
  }

  async deleteAccount(company: Company, data: any): Promise<boolean> {
    try {
      await this.delete(data);
    } catch (error) {
      console.error(error);

      logDatabaseError(reponame, error);
    }
    return true;
  }
}
