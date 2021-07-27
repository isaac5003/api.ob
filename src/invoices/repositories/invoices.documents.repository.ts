import { Company } from '../../companies/entities/Company.entity';
import { logDatabaseError } from '../../_tools';
import { EntityRepository, Repository } from 'typeorm';
import { InvoiceDocumentDBDTO } from '../dtos/invoice-document-db.dto';
import { InvoicesDocuments } from '../entities/invoices.documents.entity';
import { DocumentFilterDTO } from '../dtos/documents/invoice-documnet-filter.dto';

const reponame = ' documentos de venta';
@EntityRepository(InvoicesDocuments)
export class InvoicesDocumentsRepository extends Repository<InvoicesDocuments> {
  async getInvoicesDocuments(company: Company, filter?: DocumentFilterDTO): Promise<InvoicesDocuments[]> {
    let active, documentType;
    if (filter) {
      active = filter.active;
      documentType = filter.documentType;
    }

    let documents: InvoicesDocuments[];

    const leftJoinAndSelect = {
      dt: 'i.documentType',
    };

    let filters = {};
    filters = { company, isCurrentDocument: true };
    if (documentType) {
      filters = { ...filters, dt: documentType };
    }
    if (active == true || active == false) {
      filters == { ...filters, active };
    }

    try {
      documents = await this.find({
        where: filters,
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

  async getSequenceAvailable(
    company: Company,
    documentType: number,
    sequenceReserved?: number[],
  ): Promise<InvoicesDocuments> {
    let document;
    const leftJoinAndSelect = {
      dt: 'i.documentType',
    };
    try {
      document = await this.findOneOrFail({
        join: {
          alias: 'i',
          leftJoinAndSelect,
        },
        where: { company, isCurrentDocument: true, documentType },
      });

      if (document) {
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
      } else {
        document = {};
      }
    } catch (error) {
      console.error(error);
      logDatabaseError(reponame, error);
    }
    return document;
  }

  async getDocumentsByIds(company: Company, id: string[], type?: string): Promise<InvoicesDocuments[]> {
    let invoiceDocuments;
    const leftJoinAndSelect = {
      dt: 'i.documentType',
    };

    let filter = {};
    switch (type) {
      case 'used':
        filter = { company, used: true };
        break;
      case 'unused':
        filter = { company, used: false };
        break;
      default:
        filter = { company };
        break;
    }

    try {
      invoiceDocuments = await this.findByIds(id, {
        where: filter,
        join: {
          alias: 'i',
          leftJoinAndSelect,
        },
      });
    } catch (error) {
      console.error(error);
      logDatabaseError(reponame, error);
    }

    invoiceDocuments = invoiceDocuments.map((i) => {
      return {
        ...i,
        documentLayout: i.documentLayout,
      };
    });
    return invoiceDocuments;
  }

  async createUpdateDocument(company: Company, documents: any, type: string): Promise<InvoicesDocuments[]> {
    try {
      let document;
      switch (type) {
        case 'create':
          document = this.create([...documents]);
          break;
        case 'update':
          document = documents;
          break;
      }
      return await this.save(document);
    } catch (error) {
      logDatabaseError(reponame, error);
    }
  }

  async updateInvoiceDocument(id: string, data: Partial<InvoiceDocumentDBDTO>, company: Company): Promise<any> {
    try {
      return await this.update({ id, company }, data);
    } catch (error) {
      console.error(error);
      logDatabaseError(reponame, error);
    }
  }
}
