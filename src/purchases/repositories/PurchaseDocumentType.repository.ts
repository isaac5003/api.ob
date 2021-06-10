import { EntityRepository, Repository } from 'typeorm';
import { PurchasesDocumentType } from '../entities/PurchasesDocumentType.entity';

@EntityRepository(PurchasesDocumentType)
export class PurchasesDocumentTypeRepository extends Repository<PurchasesDocumentType> {}
