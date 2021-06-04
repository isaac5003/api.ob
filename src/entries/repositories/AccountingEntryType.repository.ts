import { Company } from '../../companies/entities/Company.entity';
import { logDatabaseError } from '../../_tools';
import { EntityRepository, Repository } from 'typeorm';
import { AccountingEntryType } from '../entities/AccountingEntryType.entity';

const reponame = 'tipo de partida contable';
@EntityRepository(AccountingEntryType)
export class AccountingEntryTypeRepository extends Repository<AccountingEntryType> {
  async getEntryTypes(company: Company): Promise<{ data: AccountingEntryType[]; count: number }> {
    let entryTypes: AccountingEntryType[];
    try {
      entryTypes = await this.find({
        where: { company },
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      logDatabaseError(reponame, error);
    }
    return { data: entryTypes, count: entryTypes.length };
  }

  async getEntryType(company: Company, id: string): Promise<AccountingEntryType> {
    let entryType: AccountingEntryType;
    try {
      entryType = await this.findOneOrFail({ id, company });
    } catch (error) {
      logDatabaseError(reponame, error);
    }
    return entryType;
  }
}