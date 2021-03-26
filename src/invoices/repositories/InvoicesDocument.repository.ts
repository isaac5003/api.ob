import { EntityRepository, Repository } from 'typeorm';
import { InvoicesDocument } from '../entities/InvoicesDocument.entity';

@EntityRepository(InvoicesDocument)
export class InvoicesDocumentRepository extends Repository<InvoicesDocument> {}
