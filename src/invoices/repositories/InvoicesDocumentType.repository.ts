import { logDatabaseError } from 'src/_tools';
import { EntityRepository, Repository } from 'typeorm';
import { InvoicesDocumentType } from '../entities/InvoicesDocumentType.entity';

const reponame = 'tipo de documento';
@EntityRepository(InvoicesDocumentType)
export class InvoicesDocumentTypeRepository extends Repository<InvoicesDocumentType> {
  async getInvoiceDocumentTypes(): Promise<InvoicesDocumentType[]> {
    let documentTypes: InvoicesDocumentType[];
    try {
      documentTypes = await this.find({
        order: {
          createdAt: 'DESC',
        },
      });
    } catch (error) {
      logDatabaseError(reponame, error);
    }
    return documentTypes;
  }

  async getInvoiceDocumentType(id: number): Promise<InvoicesDocumentType> {
    let invoicesDocumentType: InvoicesDocumentType;

    try {
      invoicesDocumentType = await this.findOneOrFail({ id });
    } catch (error) {
      logDatabaseError(reponame, error);
    }
    return invoicesDocumentType;
  }
}
