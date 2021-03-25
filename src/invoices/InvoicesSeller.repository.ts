import { EntityRepository, Repository } from 'typeorm';
import { InvoicesSeller } from './InvoicesSeller.entity';

@EntityRepository(InvoicesSeller)
export class InvoicesSellerRepository extends Repository<InvoicesSeller> {}
