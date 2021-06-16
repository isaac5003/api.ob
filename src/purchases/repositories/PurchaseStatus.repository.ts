import { logDatabaseError } from 'src/_tools';
import { EntityRepository, Repository } from 'typeorm';
import { PurchasesStatus } from '../entities/PurchasesStatus.entity';

const reponame = 'estado de compra';
@EntityRepository(PurchasesStatus)
export class PurchasesStatusRepository extends Repository<PurchasesStatus> {
  async getPurchsesStatus(id: number): Promise<PurchasesStatus> {
    let purchasesStatus: PurchasesStatus;
    try {
      purchasesStatus = await this.findOneOrFail({ id });
    } catch (error) {
      logDatabaseError(reponame, error);
    }
    return purchasesStatus;
  }
}
