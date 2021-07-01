import { logDatabaseError } from 'src/_tools';
import { EntityRepository, Repository } from 'typeorm';
import { PurchasesDocumentType } from '../entities/PurchasesDocumentType.entity';

const reponame = 'registro de compras';
@EntityRepository(PurchasesDocumentType)
export class PurchasesDocumentTypeRepository extends Repository<PurchasesDocumentType> {
  async getPurchaseDocumentTypes(ids?: number[]): Promise<{ data: PurchasesDocumentType[]; count: number }> {
    try {
      let data;
      if (ids) {
        data = await this.findByIds(ids);
      } else {
        data = await this.find();
      }
      return { data, count: data.length };
    } catch (error) {
      logDatabaseError(reponame, error);
    }
  }
}
