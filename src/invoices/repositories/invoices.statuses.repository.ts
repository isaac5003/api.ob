import { logDatabaseError } from '../../_tools';
import { EntityRepository, Repository } from 'typeorm';
import { InvoicesStatuses } from '../entities/invoices.statuses.entity';

const reponame = 'estado del documento';
@EntityRepository(InvoicesStatuses)
export class InvoicesStatusesRepository extends Repository<InvoicesStatuses> {
  async getInvoicesStatuses(): Promise<{ data: InvoicesStatuses[]; count: number }> {
    let statuses: InvoicesStatuses[];
    try {
      statuses = await this.find();
    } catch (error) {
      logDatabaseError(reponame, error);
    }
    return { data: statuses, count: statuses.length };
  }

  async getInvoicesStatus(id: number): Promise<InvoicesStatuses> {
    let invoiceStatus: InvoicesStatuses;
    try {
      invoiceStatus = await this.findOneOrFail({ id });
    } catch (error) {
      logDatabaseError(reponame, error);
    }
    return invoiceStatus;
  }
}
