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

  async getSequenceAvailable(
    company: Company,
    documentType: number,
    sequenceReserved?: number[],
  ): Promise<InvoicesDocument> {
    let document;
    const leftJoinAndSelect = {
      dt: 'i.documentType',
    };
    try {
      document = await this.findOne({
        join: {
          alias: 'i',
          leftJoinAndSelect,
        },
        where: { company, isCurrentDocument: true, documentType },
      });
      let sequence = document.current;
      if (sequenceReserved) {
        if (sequenceReserved.includes(sequence)) {
          for (const is of sequenceReserved) {
            for (let s = sequence; s <= document.final; s++) {
              if (s != is) {
                sequence = s;
                s = document.final;
              }
            }
          }
        }
      }

      document = {
        ...document,
        current: sequence,
      };
    } catch (error) {
      console.error(error);

      logDatabaseError(reponame, error);
    }

    return document;
  }
}
