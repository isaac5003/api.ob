import { logDatabaseError } from 'src/_tools';
import { EntityRepository, Repository } from 'typeorm';
import { PurchasesDocumentType } from '../entities/PurchasesDocumentType.entity';

const reponame = 'registro de compras';
@EntityRepository(PurchasesDocumentType)
export class PurchasesDocumentTypeRepository extends Repository<PurchasesDocumentType> {
  async getPurchaseDocumentTypes(ids?: number[]): Promise<PurchasesDocumentType[]> {
    try {
      return ids ? await this.findByIds(ids) : await this.find();
    } catch (error) {
      logDatabaseError(reponame, error);
    }
  }
}
