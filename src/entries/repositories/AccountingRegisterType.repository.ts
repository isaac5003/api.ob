import { Company } from 'src/companies/entities/Company.entity';
import { logDatabaseError } from 'src/_tools';
import { EntityRepository, Repository } from 'typeorm';
import { AccountingRegisterType } from '../entities/AccountingRegisterType.entity';

@EntityRepository(AccountingRegisterType)
export class AccountingRegisterTypeRepository extends Repository<AccountingRegisterType> {
  async getResgisterType(company: Company): Promise<AccountingRegisterType[]> {
    let registerType: AccountingRegisterType[];
    try {
      registerType = await this.find({
        order: { createdAt: 'DESC' },
        where: { company },
      });
    } catch (error) {
      logDatabaseError('tipo de registro', error);
    }

    return registerType;
  }
}
