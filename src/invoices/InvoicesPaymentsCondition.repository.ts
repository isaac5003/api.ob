import { EntityRepository, Repository } from 'typeorm';
import { InvoicesPaymentsCondition } from './InvoicesPaymentsCondition.entity';

@EntityRepository(InvoicesPaymentsCondition)
export class InvoicesPaymentsConditionRepository extends Repository<InvoicesPaymentsCondition> {}
