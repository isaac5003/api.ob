import { EntityRepository, Repository } from 'typeorm';
import { AccountingRegisterType } from './AccountingRegisterType.entity';

@EntityRepository(AccountingRegisterType)
export class AccountingRegisterTypeRepository extends Repository<AccountingRegisterType> {}
