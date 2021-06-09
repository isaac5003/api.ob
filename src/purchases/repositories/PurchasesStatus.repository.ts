import { logDatabaseError } from '../../_tools';
import { EntityRepository, Repository } from 'typeorm';
import { PurchasesStatus } from '../entities/PurchasesStatus.entity';

const reponame = 'estado de la compra';
@EntityRepository(PurchasesStatus)
export class PurchasesStatusRepository extends Repository<PurchasesStatus> {
  async getPurchasesStatuses(): Promise<PurchasesStatus[]> {
    let statuses: PurchasesStatus[];
    try {
      statuses = await this.find();
    } catch (error) {
      logDatabaseError(reponame, error);
    }
    return statuses;
  }

  async getPurchasesStatus(id: number): Promise<PurchasesStatus> {
    let invoiceStatus: PurchasesStatus;
    try {
      invoiceStatus = await this.findOneOrFail({ id });
    } catch (error) {
      logDatabaseError(reponame, error);
    }
    return invoiceStatus;
  }
}
