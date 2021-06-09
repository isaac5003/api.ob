import { EntityRepository, Repository } from 'typeorm';
import { PurchasesPaymentsCondition } from '../entities/PurchasesPaymentsCondition.entity';

@EntityRepository(PurchasesPaymentsCondition)
export class PurchasesPaymentsConditionRepository extends Repository<PurchasesPaymentsCondition> {}
