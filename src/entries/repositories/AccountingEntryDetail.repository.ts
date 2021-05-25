import { Company } from '../../companies/entities/Company.entity';
import { logDatabaseError } from '../../_tools';
import { EntityRepository, Repository } from 'typeorm';
import { AccountingEntryDetail } from '../entities/AccountingEntryDetail.entity';

const reponame = 'detalles de partida contable';
@EntityRepository(AccountingEntryDetail)
export class AccountingEntryDetailRepository extends Repository<AccountingEntryDetail> {
  async getDetailsForReport(company: Company, data: any, type: string): Promise<AccountingEntryDetail[]> {
    const startDate = data.startDate ? data.startDate : '';
    const endDate = data.endDate ? data.endDate : '';
    const selectedAccounts = data.selectedAccounts ? JSON.parse(data.selectedAccounts) : '';
    try {
      let entries = this.createQueryBuilder('entries')
        .leftJoinAndSelect('entries.accountingCatalog', 'ac')
        .leftJoinAndSelect('entries.accountingEntry', 'aed')
        .where({ company });

      switch (type) {
        case 'rangeDetails':
          if (startDate) {
            entries = entries.andWhere('aed.date >= :startDate', {
              startDate,
            });
          }
          entries = entries.andWhere('aed.date <= :endDate', {
            endDate,
          });

          if (selectedAccounts.length > 0) {
            entries = entries.andWhere('ac.id IN (:...ids)', {
              ids: selectedAccounts,
            });
          }
          break;
        case 'previousDetail':
          if (startDate) {
            entries = entries.andWhere('aed.date < :startDate', {
              startDate,
            });
          }
          if (selectedAccounts.length > 0) {
            entries = entries.andWhere('ac.id IN (:...ids)', {
              ids: selectedAccounts,
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
