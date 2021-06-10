import { EntityRepository, Repository } from 'typeorm';
import { PurchaseDetail } from '../entities/PurchaseDetail.entity';

@EntityRepository(PurchaseDetail)
export class PurchaseDetailRepository extends Repository<PurchaseDetail> {}
