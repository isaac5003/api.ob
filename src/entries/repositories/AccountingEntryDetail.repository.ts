import { startOfMonth, endOfMonth } from 'date-fns';
import { Company } from 'src/companies/entities/Company.entity';
import { logDatabaseError } from 'src/_tools';
import { EntityRepository, Repository } from 'typeorm';
import { DiarioMayorDTO } from '../dtos/entries-libromayor-report.dto';
import { AccountingEntryDetail } from '../entities/AccountingEntryDetail.entity';

const reponame = 'detalles de partida contable';
@EntityRepository(AccountingEntryDetail)
export class AccountingEntryDetailRepository extends Repository<AccountingEntryDetail> {
  async getDetailsForReport(
    company: Company,
    { date }: DiarioMayorDTO,
    type: string,
  ): Promise<AccountingEntryDetail[]> {
    const newDate = new Date(date);
    try {
      let entries = this.createQueryBuilder('entries')
        .leftJoinAndSelect('entries.accountingCatalog', 'ac')
        .leftJoinAndSelect('entries.accountingEntry', 'aed')
        .where({ company });

      switch (type) {
        case 'rangeDetails':
          if (newDate) {
            entries = entries.andWhere('aed.date >= :startDate', {
              startDate: startOfMonth(newDate),
            });
            entries = entries.andWhere('aed.date <= :endDate', {
              endDate: endOfMonth(newDate),
            });
          }
          break;
        case 'previousDetail':
          if (newDate) {
            entries = entries.andWhere('aed.date < :startDate', {
              startDate: startOfMonth(newDate),
            });
          }
          break;
      }

      return await entries.getMany();
    } catch (error) {
      console.error(error);

      logDatabaseError(reponame, error);
    }
  }

  async createEntryDetails(data: any[]): Promise<AccountingEntryDetail> {
    let response;
    try {
      const detail = this.create(data);
      response = await this.save(detail);
    } catch (error) {
      console.error(error);

      logDatabaseError(reponame, error);
    }
    return await response;
  }

  async deleteEntryDetail(ids: any[]): Promise<boolean> {
    try {
      if (ids.length > 0) {
        await this.delete(ids);
      }
    } catch (error) {
      console.error(error);

      logDatabaseError(reponame, error);
    }
    return true;
  }
}
