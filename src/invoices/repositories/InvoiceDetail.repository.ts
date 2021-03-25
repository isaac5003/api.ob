import { EntityRepository, Repository } from 'typeorm';
import { InvoiceDetail } from '../entities/InvoiceDetail.entity';

@EntityRepository(InvoiceDetail)
export class InvoiceDetailRepository extends Repository<InvoiceDetail> {}
