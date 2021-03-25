import { EntityRepository, Repository } from 'typeorm';
import { InvoicesDocumentType } from './InvoicesDocumentType.entity';

@EntityRepository(InvoicesDocumentType)
export class InvoicesDocumentTypeRepository extends Repository<InvoicesDocumentType> {}
