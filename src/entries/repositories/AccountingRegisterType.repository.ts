import { EntityRepository, Repository } from 'typeorm';
import { AccountingRegisterType } from '../entities/AccountingRegisterType.entity';

@EntityRepository(AccountingRegisterType)
export class AccountingRegisterTypeRepository extends Repository<AccountingRegisterType> {}
