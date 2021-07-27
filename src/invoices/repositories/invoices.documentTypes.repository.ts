import { logDatabaseError } from '../../_tools';
import { EntityRepository, Repository } from 'typeorm';
import { InvoicesDocumentTypes } from '../entities/invoices.documentTypes.entity';

const reponame = 'tipo de documento';
@EntityRepository(InvoicesDocumentTypes)
export class InvoicesDocumentTypeRepository extends Repository<InvoicesDocumentTypes> {
  async getInvoiceDocumentsType(): Promise<{ data: InvoicesDocumentTypes[]; count: number }> {
    let documentTypes: InvoicesDocumentTypes[];
    try {
      documentTypes = await this.find({
        order: {
          createdAt: 'DESC',
        },
      });
    } catch (error) {
      logDatabaseError(reponame, error);
    }
    return { data: documentTypes, count: documentTypes.length };
  }

  async documentTypesByIds(id: number[]): Promise<InvoicesDocumentTypes[]> {
    let documentTypes;
    try {
      documentTypes = await this.findByIds(id);
    } catch (error) {
      logDatabaseError(reponame, error);
    }

    return documentTypes;
  }

  async getInvoiceDocumentTypes(ids?: number[]): Promise<InvoicesDocumentTypes[]> {
    try {
      return ids ? await this.findByIds(ids) : await this.find();
    } catch (error) {
      logDatabaseError(reponame, error);
    }
  }
}
