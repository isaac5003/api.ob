import { Company } from '../../companies/entities/Company.entity';
import { logDatabaseError } from '../../_tools';
import { EntityRepository, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { SeriesDTO } from '../dtos/serie/entries-series.dto';
import { AccountingEntry } from '../entities/AccountingEntry.entity';
import { startOfMonth, endOfMonth } from 'date-fns';
import { EntriesFilterDTO } from '../dtos/entries-filter.dto';
import { ResponseMinimalDTO } from '../../_dtos/responseList.dto';

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

  async getEntries(company: Company, filter: EntriesFilterDTO): Promise<AccountingEntry[]> {
    try {
      const { limit, page, search, squared, accounted, startDate, endDate, entryType, prop, order } = filter;

      let entries = this.createQueryBuilder('entries')
        .select([
          'entries.id',
          'entries.serie',
          'entries.title',
          'entries.date',
          'entries.squared',
          'entries.accounted',
          'aet.id',
          'aet.name',
          'aet.code',
          'sum(aed.cargo) cargo',
          'aed.id',
          'aed.cargo',
        ])
        .leftJoin('entries.accountingEntryType', 'aet')
        .leftJoin('entries.accountingEntryDetails', 'aed')
        .where({ company })
        .groupBy('entries.id')
        .addGroupBy('aet.id')
        .addGroupBy('aed.id');

      if (search) {
        entries = entries.andWhere('(LOWER(entries.title) LIKE :search) ', {
          search: `%${search}%`,
        });
      }
      if (order && prop) {
        let field = `entries.${prop}`;
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
        entries = entries.orderBy('entries.createdAt', 'DESC');
      }
      if (limit && page) {
        entries = entries.limit(limit).offset(page * limit);
      }

      if (squared == true) {
        entries = entries.andWhere('entries.squared = :squared', {
          squared: squared == true,
        });
      }
      if (accounted == true) {
        entries = entries.andWhere('entries.accounted = :accounted', {
          accounted: accounted == true,
        });
      }
      if (startDate && endDate) {
        entries = entries.andWhere('entries.date >= :startDate', {
          startDate,
        });
        entries = entries.andWhere('entries.date <= :endDate', { endDate });
      }
      if (entryType) {
        entries = entries.andWhere('entries.accountingEntryTypeId = :entryType', {
          entryType,
        });
      }

      return await entries.getMany();
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
    try {
      await this.delete(entryHeader);
    } catch (error) {
      console.error(error);

      logDatabaseError(reponame, error);
    }
    return true;
  }
}
