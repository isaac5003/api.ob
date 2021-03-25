import { EntityRepository, Repository } from 'typeorm';
import { Invoice } from './Invoice.entity';

@EntityRepository(Invoice)
export class InvoiceRepository extends Repository<Invoice> {}
