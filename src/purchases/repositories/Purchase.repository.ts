import { EntityRepository, Repository } from 'typeorm';
import { Purchase } from '../entities/Purchase.entity';

@EntityRepository(Purchase)
export class PurchaseRepository extends Repository<Purchase> {}
