import { EntityRepository, Repository } from 'typeorm';
import { PurchasesStatus } from '../entities/PurchasesStatus.entity';

@EntityRepository(PurchasesStatus)
export class PurchasesStatusRepository extends Repository<PurchasesStatus> {}
