import { EntityRepository, Repository } from 'typeorm';
import { InvoiceDetail } from './InvoiceDetail.entity';

@EntityRepository(InvoiceDetail)
export class InvoiceDetailRepository extends Repository<InvoiceDetail> {}
