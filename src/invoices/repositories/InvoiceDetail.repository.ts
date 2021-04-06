import { logDatabaseError } from 'src/_tools';
import { EntityRepository, Repository } from 'typeorm';
import { InvoiceDetailDataDTO } from '../dtos/invoice-details-dat.dto';
import { InvoiceDetail } from '../entities/InvoiceDetail.entity';

const reponame = 'detalle del documento';
@EntityRepository(InvoiceDetail)
export class InvoiceDetailRepository extends Repository<InvoiceDetail[]> {
  async createInvoiceDetail(
    data: InvoiceDetailDataDTO[],
  ): Promise<InvoiceDetail> {
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
