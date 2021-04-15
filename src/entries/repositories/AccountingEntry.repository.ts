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
}
