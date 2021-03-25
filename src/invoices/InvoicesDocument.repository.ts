import { EntityRepository, Repository } from 'typeorm';
import { InvoicesDocument } from './InvoicesDocument.entity';

@EntityRepository(InvoicesDocument)
export class InvoicesDocumentRepository extends Repository<InvoicesDocument> {}
