import { BadRequestException } from '@nestjs/common';
import { Company } from '../../companies/entities/Company.entity';
import { FilterDTO } from '../../_dtos/filter.dto';
import { logDatabaseError } from '../../_tools';
import { EntityRepository, Repository } from 'typeorm';
import { AccountingCatalog } from '../entities/AccountingCatalog.entity';
import { paginateRaw } from 'nestjs-typeorm-paginate';

const reponame = 'catalogo de cuentas';
@EntityRepository(AccountingCatalog)
export class AccountingCatalogRepository extends Repository<AccountingCatalog> {
  async getAccountingCatalogs(
    company: Company,
    filter: FilterDTO,
  ): Promise<{ data: AccountingCatalog[]; count: number }> {
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
          'pc.id',
          'pc.code',
          'pc.name',
        ])
        .where({ company })
        .leftJoin('ac.accountingCatalogs', 'sa')
        .leftJoin('ac.parentCatalog', 'pc')
        .orderBy('ac.code', 'ASC');

      if (search) {
        query.andWhere('(LOWER(ac.name) LIKE :search) OR (LOWER(ac.code) LIKE :search) ', {
          search: `%${search}%`,
        });
      }

      const count = await query.getCount();
      const data = await paginateRaw<any>(query, { limit: limit ? limit : null, page: page ? page : null });
      return { data: data.items, count };
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

  async getAccountingCatalog(id: string, company: Company, join: boolean): Promise<AccountingCatalog> {
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

  async getAccountingCatalogNotUsed(accountingCatalog: any, company: Company): Promise<AccountingCatalog> {
    const account = await this.getAccountingCatalog(accountingCatalog as string, company, true);
    if (account.isParent) {
      throw new BadRequestException("La 'cuenta contable' selecciona no puede ser utilizada ya que no es asignable.");
    }
    return account;
  }

  async createAccounts(data: any, company: Company): Promise<AccountingCatalog[]> {
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
