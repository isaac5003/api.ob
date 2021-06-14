import { EntityRepository, Repository } from 'typeorm';
import { PurchasesDocumentType } from '../entities/PurchasesDocumentType.entity';

@EntityRepository(PurchasesDocumentType)
export class PurchasesDocumentTypeRepository extends Repository<PurchasesDocumentType> {
  async getPurchaseDocumentTypes(ids?: number[]): Promise<InvoicesDocumentType[]> {
    try {
      return ids ? await this.findByIds(ids) : await this.find();
    } catch (error) {
      logDatabaseError(reponame, error);
    }
  }
}
