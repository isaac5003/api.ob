import { Company } from 'src/companies/entities/Company.entity';
import { logDatabaseError } from 'src/_tools';
import { EntityRepository, Repository } from 'typeorm';
import { InvoiceDocumentDataDTO } from '../dtos/invoice-document-data.dto';
import { InvoicesDocument } from '../entities/InvoicesDocument.entity';

const reponame = ' documentos de venta';
@EntityRepository(InvoicesDocument)
export class InvoicesDocumentRepository extends Repository<InvoicesDocument> {
  async getInvoicesDocuments(company: Company): Promise<InvoicesDocument[]> {
    let documents: InvoicesDocument[];
    const leftJoinAndSelect = {
      dt: 'i.documentType',
    };
    try {
      documents = await this.find({
        where: { company },
        join: {
          alias: 'i',
          leftJoinAndSelect,
        },
      });
    } catch (error) {
      logDatabaseError(reponame, error);
    }
    return documents;
  }

  async updateInvoiceDocument(
    id: string,
    data: Partial<InvoiceDocumentDataDTO>,
    company: Company,
  ): Promise<any> {
    try {
      const document = this.update({ id, company }, data);
      return document;
    } catch (error) {
      logDatabaseError(reponame, error);
    }
  }
}
