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
import { startOfMonth, endOfMonth } from 'date-fns';
import { EntriesFilterDTO } from '../dtos/entries-filter.dto';

const reponame = 'entry';
@EntityRepository(AccountingEntry)
export class AccountingEntryRepository extends Repository<AccountingEntry> {
  async getSeries(
    company: Company,
    data: SeriesDTO,
  ): Promise<AccountingEntry[]> {
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

    return entries;
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
        .leftJoinAndSelect('entries.customerType', 'customerType')
        .leftJoinAndSelect('entries.customerTypeNatural', 'customerTypeNatural')
        .where({ company });

      if (search) {
        entries.andWhere('(LOWER(customer.name) LIKE :search)', {
          search: `%${search}%`,
        });
      }

      if (order && prop) {
        switch (prop) {
          case 'accountingEntryType':
            entries = entries.orderBy(
              'ae.accountingEntryType',
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

      return await entries.getMany();
    } catch (error) {
      logDatabaseError(reponame, error);
    }
  }
}
