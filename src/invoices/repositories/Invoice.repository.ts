import { EntityRepository, Repository } from 'typeorm';
import { Invoice } from '../entities/Invoice.entity';

@EntityRepository(Invoice)
export class InvoiceRepository extends Repository<Invoice> {}
