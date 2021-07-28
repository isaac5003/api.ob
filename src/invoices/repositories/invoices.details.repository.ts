import { logDatabaseError } from '../../_tools';
import { EntityRepository, Repository } from 'typeorm';
import { InvoiceDetailDataDTO } from '../dtos/invoice-details-dat.dto';
import { InvoicesDetails } from '../entities/invoices.details.entity';

const reponame = 'detalle del documento';
@EntityRepository(InvoicesDetails)
export class InvoicesDetailsRepository extends Repository<InvoicesDetails[]> {
  async createInvoicesDetail(data: Partial<InvoiceDetailDataDTO>[]): Promise<InvoicesDetails> {
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

  async deleteInvoicesDetails(ids: string[]): Promise<boolean> {
    try {
      if (ids.length > 0) {
        await this.delete(ids);
      }
    } catch (error) {
      console.error(error);

      logDatabaseError(reponame, error);
    }
    return true;
  }
}
