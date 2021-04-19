import { logDatabaseError } from 'src/_tools';
import { EntityRepository, Repository } from 'typeorm';
import { InvoicesStatus } from '../entities/InvoicesStatus.entity';

const reponame = 'estado del documento';
@EntityRepository(InvoicesStatus)
export class InvoicesStatusRepository extends Repository<InvoicesStatus> {
  async getInvoicesStatuses(): Promise<InvoicesStatus[]> {
    let statuses: InvoicesStatus[];
    try {
      statuses = await this.find();
    } catch (error) {
      logDatabaseError(reponame, error);
    }
    return statuses;
  }

  async getInvoicesStatus(id: number): Promise<InvoicesStatus> {
    let invoiceStatus: InvoicesStatus;
    try {
      invoiceStatus = await this.findOneOrFail({ id });
    } catch (error) {
      logDatabaseError(reponame, error);
    }
    return invoiceStatus;
  }
}
