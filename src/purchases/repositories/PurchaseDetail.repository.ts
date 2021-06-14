import { logDatabaseError } from 'src/_tools';
import { EntityRepository, Repository } from 'typeorm';
import { PurchaseDetailDTO } from '../dto/validate/purchase-detail.vdto';
import { PurchaseDetail } from '../entities/PurchaseDetail.entity';

const reponame = 'detalle de compra';
@EntityRepository(PurchaseDetail)
export class PurchaseDetailRepository extends Repository<PurchaseDetail> {
  async createPurchaseDetail(data: Partial<PurchaseDetailDTO>[]): Promise<PurchaseDetail> {
    let response;
    try {
      const invoice = this.create([...data]);
      response = await this.save(invoice);
    } catch (error) {
      console.error(error);

      logDatabaseError(reponame, error);
    }
    return await response;
  }
}
