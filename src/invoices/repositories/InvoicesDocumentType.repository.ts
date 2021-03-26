import { EntityRepository, Repository } from 'typeorm';
import { InvoicesDocumentType } from '../entities/InvoicesDocumentType.entity';

@EntityRepository(InvoicesDocumentType)
export class InvoicesDocumentTypeRepository extends Repository<InvoicesDocumentType> {}
