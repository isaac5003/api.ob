import { Company } from 'src/companies/entities/Company.entity';
import { logDatabaseError } from 'src/_tools';
import {
  EntityRepository,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { SeriesDTO } from '../dtos/entries-series.dto';
import { AccountingEntry } from '../entities/AccountingEntry.entity';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { EntriesFilterDTO } from '../dtos/entries-filter.dto';
import { ResponseMinimalDTO } from 'src/_dtos/responseList.dto';

const reponame = 'entry';
@EntityRepository(AccountingEntry)
export class AccountingEntryRepository extends Repository<AccountingEntry> {
  async getSeries(
    company: Company,
    data: SeriesDTO,
  ): Promise<ResponseMinimalDTO> {
    let entries: AccountingEntry[];
    try {
      entries = await this.find({
        select: ['serie', 'date'],
        where: {
          company,
          date:
            MoreThanOrEqual(startOfMonth(new Date(data.date))) ||
            LessThanOrEqual(endOfMonth(new Date(data.date))),
        },
      });
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

  async getEntries(
    company: Company,
    filter: EntriesFilterDTO,
  ): Promise<AccountingEntry[]> {
    try {
      const {
        limit,
        page,
        search,
        squared,
        accounted,
        startDate,
        endDate,
        entryType,
        prop,
        order,
      } = filter;

      let entries = this.createQueryBuilder('entries')
        .select([
          '(entries.id) id ',
          '(entries.serie) serie',
          '(entries.title) tittle',
          '(entries.date) date',
          '(entries.squared) squared',
          '(entries.accounted) accounted',
          'aet.id',
          'aet.name',
          'aet.code',
          'SUM(aed.cargo) cargo',
        ])
        .leftJoin('entries.accountingEntryType', 'aet')
        .leftJoin('entries.accountingEntryDetails', 'aed')
        .where({ company })
        .groupBy('entries.id')
        .addGroupBy('aet.id');

      if (search) {
        entries.andWhere(
          '(LOWER(entries.tittle) LIKE :search) OR (LOWER(entries.data) LIKE :search)',
          {
            search: `%${search}%`,
          },
        );
      }

      if (limit && page) {
        entries.take(limit).skip(limit ? (page ? page - 1 : 0) * limit : null);
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
        entries = entries.andWhere(
          'entries.accountingEntryTypeId = :entryType',
          {
            entryType,
          },
        );
      }
      if (order && prop) {
        switch (prop) {
          case 'accountingEntryType':
            entries = entries.orderBy(
              'entries.accountingEntryType',
              order == 'ascending' ? 'ASC' : 'DESC',
            );
            break;
          default:
            entries = entries.orderBy(
              `${prop}`,
              order == 'ascending' ? 'ASC' : 'DESC',
            );
        }
      } else {
        entries = entries.orderBy('entries.createdAt', 'DESC');
      }

      return await entries.getRawMany();
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
}
