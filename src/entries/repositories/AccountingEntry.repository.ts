import { Company } from '../../companies/entities/Company.entity';
import { logDatabaseError } from '../../_tools';
import { EntityRepository, Repository } from 'typeorm';
import { SeriesDTO } from '../dtos/serie/entries-series.dto';
import { AccountingEntry } from '../entities/AccountingEntry.entity';
import { startOfMonth, endOfMonth, format, parseISO, parseJSON } from 'date-fns';
import { EntriesFilterDTO } from '../dtos/entries-filter.dto';
import { ResponseMinimalDTO } from '../../_dtos/responseList.dto';
import { paginateRaw } from 'nestjs-typeorm-paginate';

const reponame = 'partida contable';
@EntityRepository(AccountingEntry)
export class AccountingEntryRepository extends Repository<AccountingEntry> {
  async getSeries(company: Company, data: SeriesDTO): Promise<ResponseMinimalDTO> {
    let entries;
    try {
      entries = await this.createQueryBuilder('ae')
        .select(['ae.serie', 'ae.date'])
        .leftJoin('ae.accountingEntryType', 'aet')
        .where('ae.company = :company', { company: company.id })
        .andWhere('aet.id = :accountingEntryType', { accountingEntryType: data.accountingEntryType })
        .andWhere('ae.date >= :startDate', {
          startDate: startOfMonth(new Date(data.date)),
        })
        .andWhere('ae.date <= :endDate', { endDate: endOfMonth(new Date(data.date)) })
        .getMany();
    } catch (error) {
      logDatabaseError('series', error);
    }
    const currentEntries = entries
      .map((e) => parseInt(e.serie))
      .sort((a, b) => {
        if (a < b) return 1;
        if (a > b) return -1;
        return 0;
      });

    return {
      nextSerie: currentEntries.length > 0 ? currentEntries[0] + 1 : 1,
    };
  }

  async getEntries(company: Company, filter: EntriesFilterDTO): Promise<{ data: any[]; count: number }> {
    try {
      const { limit, page, search, squared, accounted, startDate, endDate, entryType, prop, order } = filter;

      let entries = this.createQueryBuilder('ae')
        .select([
          'ae.id',
          'ae.serie',
          'ae.title',
          'ae.date',
          'ae.squared',
          'ae.accounted',
          'ae.createdAt',
          'aet.id',
          'aet.name',
          'aet.code',
        ])
        .leftJoin('ae.accountingEntryType', 'aet')
        .leftJoin('ae.accountingEntryDetails', 'aed')
        .addSelect('sum(aed.cargo) as cargo')
        .where({ company })
        .groupBy('ae.id')
        .addGroupBy('aet.id');

      if (search) {
        entries = entries.andWhere('(LOWER(ae.title) LIKE :search) ', {
          search: `%${search}%`,
          company: company.id,
        });
      }

      if (order && prop) {
        let field = `ae.${prop}`;
        switch (prop) {
          case 'cargo':
            field = `cargo`;
            break;

          case 'accountingEntryType':
            field = `aet.id`;
            break;
        }
        entries.orderBy(field, order == 'ascending' ? 'ASC' : 'DESC');
      } else {
        entries = entries.orderBy('ae.createdAt', 'DESC');
      }

      if (squared == true) {
        entries = entries.andWhere('ae.squared = :squared', {
          squared: squared == true,
        });
      }
      if (accounted == true) {
        entries = entries.andWhere('ae.accounted = :accounted', {
          accounted: accounted == true,
        });
      }
      if (startDate && endDate) {
        entries = entries.andWhere('ae.date >= :startDate', {
          startDate,
        });
        entries = entries.andWhere('ae.date <= :endDate', { endDate });
      }
      if (entryType) {
        entries = entries.andWhere('ae.accountingEntryTypeId = :entryType', {
          entryType,
        });
      }

      const count = await entries.getCount();

      const data = await paginateRaw<any>(entries, { limit: limit ? limit : null, page: page ? page : null });

      return {
        data: data.items.map((d) => {
          const aekeys = Object.keys(d).filter((k) => k.startsWith('ae_'));
          const aetkeys = Object.keys(d).filter((k) => k.startsWith('aet_'));
          const root: Partial<AccountingEntry> = {};
          const accountingEntryType = {};
          for (const v of aekeys) {
            root[v.replace('ae_', '')] = d[v];
          }

          for (const v of aetkeys) {
            accountingEntryType[v.replace('aet_', '')] = d[v];
          }

          return {
            ...root,
            cargo: d.cargo,
            accountingEntryType,
            date: format(parseJSON(root.date), 'dd/MM/yyyy'),
          };
        }),

        count,
      };
    } catch (error) {
      console.error(error);

      logDatabaseError(reponame, error);
    }
  }

  async getEntry(company: Company, id: string): Promise<AccountingEntry> {
    let entry: AccountingEntry;
    const leftJoinAndSelect = {
      aet: 'ae.accountingEntryType',
      aed: 'ae.accountingEntryDetails',
      ac: 'aed.accountingCatalog',
    };

    try {
      entry = await this.findOneOrFail(
        { id, company },
        {
          join: {
            alias: 'ae',
            leftJoinAndSelect,
          },
        },
      );
    } catch (error) {
      console.error(error);

      logDatabaseError(reponame, error);
    }

    return entry;
  }

  async createUpdateEntry(data: any, type?: string): Promise<AccountingEntry> {
    let response: any;
    try {
      let entry;
      switch (type) {
        case 'create':
          entry = this.create({ ...data });
          break;
        case 'update':
          entry = data;
          break;
      }

      response = await this.save(entry);
    } catch (error) {
      console.error(error);

      logDatabaseError(reponame, error);
    }
    return await response;
  }

  async deleteEntry(company: Company, id: string): Promise<boolean> {
    const entryHeader = await this.getEntry(company, id);
    delete entryHeader.accountingEntryDetails;
    let result;
    try {
      result = await this.delete(entryHeader.id);
    } catch (error) {
      console.error(error);

      logDatabaseError(reponame, error);
    }
    if (result.affected == 1) {
      return true;
    }
    return false;
  }
}
