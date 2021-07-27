import { logDatabaseError } from '../../_tools';
import { EntityRepository, Repository } from 'typeorm';
import { InvoicesDocumentType } from '../entities/InvoicesDocumentType.entity';

const reponame = 'tipo de documento';
@EntityRepository(InvoicesDocumentType)
export class InvoicesDocumentTypesRepository extends Repository<InvoicesDocumentType> {
  async getInvoiceDocumentsType(): Promise<{ data: InvoicesDocumentType[]; count: number }> {
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
    return { data: documentTypes, count: documentTypes.length };
  }

  async documentTypesByIds(id: number[]): Promise<InvoicesDocumentType[]> {
    let documentTypes;
    try {
      documentTypes = await this.findByIds(id);
    } catch (error) {
      logDatabaseError(reponame, error);
    }

    return documentTypes;
  }

  async getInvoiceDocumentTypes(ids?: number[]): Promise<InvoicesDocumentType[]> {
    try {
      return ids ? await this.findByIds(ids) : await this.find();
    } catch (error) {
      logDatabaseError(reponame, error);
    }
  }
}
