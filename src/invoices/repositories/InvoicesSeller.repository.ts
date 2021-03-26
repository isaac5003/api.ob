import { EntityRepository, Repository } from 'typeorm';
import { InvoicesSeller } from '../entities/InvoicesSeller.entity';

@EntityRepository(InvoicesSeller)
export class InvoicesSellerRepository extends Repository<InvoicesSeller> {}
