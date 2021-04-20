import { Company } from 'src/companies/entities/Company.entity';
import { logDatabaseError } from 'src/_tools';
import { EntityRepository, Repository } from 'typeorm';
import { EntryDetailsDTO } from '../dtos/entries-details-create.dto';
import { AccountingEntryDetail } from '../entities/AccountingEntryDetail.entity';

const reponame = 'detalles de partida contable';
@EntityRepository(AccountingEntryDetail)
export class AccountingEntryDetailRepository extends Repository<AccountingEntryDetail> {
  // async getDetails(entryId: string): Promise<AccountingEntryDetail[]> {
  //   try {
  //     const details = await this.find({ where: { accountingEntry: entryId } });
  //     return details;
  //   } catch (error) {
  //     console.error(error);
  //     logDatabaseError(reponame, error);
  //   }
  // }

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

  async deleteEntryDetail(ids: string[]): Promise<boolean> {
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
