import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Company } from '../../companies/entities/Company.entity';
import { ResponseListDTO, ResponseMinimalDTO, ResponseSingleDTO } from '../../_dtos/responseList.dto';
import { InvoiceDocumentLayoutDTO } from '../dtos/documents/invoice-document-layout.dto';
import { InvoiceDocumentUpdateDTO } from '../dtos/documents/invoice-document-update.dto';
import { DocumentFilterDTO } from '../dtos/documents/invoice-documnet-filter.dto';
import { ActiveValidateDTO } from '../dtos/invoice-active.dto';
import { InvoicesDocuments } from '../entities/invoices.documents.entity';
import { InvoicesDocumentRepository } from '../repositories/InvoicesDocument.repository';
import { InvoicesDocumentTypeRepository } from '../repositories/InvoicesDocumentType.repository';

Injectable();
export class InvoicesDocumentsService {
  constructor(
    @InjectRepository(InvoicesDocumentRepository)
    private invoicesDocumentRepository: InvoicesDocumentRepository,

    @InjectRepository(InvoicesDocumentTypeRepository)
    private invoicesDocumentTypeRepository: InvoicesDocumentTypeRepository,
  ) {}

  async getDocuments(
    company: Company,
    filter: DocumentFilterDTO,
  ): Promise<ResponseListDTO<any, number, number, number>> {
    const existingDocuments = await this.invoicesDocumentRepository.getInvoicesDocuments(company, filter);
    const documentTypes = await this.invoicesDocumentTypeRepository.getInvoiceDocumentTypes();

    const documents = documentTypes.map((dt) => {
      const found = existingDocuments.find((d) => d.documentType.id == dt.id);

      if (found) {
        delete found.documentLayout;
        delete found.layout;
      }
      return found
        ? { ...found }
        : {
            id: null,
            authorization: null,
            initial: null,
            final: null,
            current: null,
            active: false,
            documentType: dt,
          };
    });

    return { data: documents, count: documents.length, page: filter.page, limit: filter.limit };
  }

  async getDocument(company: Company, id: string): Promise<ResponseSingleDTO<InvoicesDocuments>> {
    const document = await this.invoicesDocumentRepository.getDocumentsByIds(company, [id]);
    return new ResponseSingleDTO(plainToClass(InvoicesDocuments, document[0]));
  }

  async createUpdateDocument(company: Company, data: InvoiceDocumentUpdateDTO[]): Promise<ResponseMinimalDTO> {
    const documentTypes = await this.invoicesDocumentTypeRepository.getInvoiceDocumentTypes(
      data.map((d) => d.documentType as unknown as number),
    );

    let documentsToProcessUpdate = [];
    let documentsToProcessCreate = [];

    const documentExist = await this.invoicesDocumentRepository.getDocumentsByIds(
      company,
      data.filter((d) => d.id).map((d) => d.id),
      'unused',
    );

    if (documentExist.length > 0) {
      documentsToProcessUpdate = data
        .filter((d) => documentExist.map((de) => de.id).includes(d.id))
        .map((d) => {
          return {
            ...d,
            documentType: documentTypes.find((dt) => dt.id == (d.documentType as unknown as number)),
          };
        });
    }

    // Obtiene los documentos ya existentes de los tipos que se van a crear
    let documents = await this.invoicesDocumentRepository.getInvoicesDocuments(company);

    documents = documents.filter((d) => documentTypes.map((dt) => dt.id).includes(d.documentType.id));
    const documentsToDisable = documents.map((d) => {
      return {
        ...d,
        isCurrentDocument: false,
        active: false,
      };
    });

    // Deshabilita los documentos
    await this.invoicesDocumentRepository.createUpdateDocument(company, documentsToDisable, 'update');

    documentsToProcessCreate = data
      .filter((d) => !documentExist.map((de) => de.id).includes(d.id))
      .map((d) => {
        delete d.id;
        return {
          ...d,
          documentType: documentTypes.find((dt) => dt.id == (d.documentType as unknown as number)),
          isCurrentDocument: true,
          company: company,
        };
      });

    const completedUpdate = await this.invoicesDocumentRepository.createUpdateDocument(
      company,
      documentsToProcessUpdate,
      'update',
    );
    const completedCreate = await this.invoicesDocumentRepository.createUpdateDocument(
      company,
      documentsToProcessCreate,
      'create',
    );

    let message = '';
    message =
      completedCreate.length > 0 && completedUpdate.length > 0
        ? 'Se han creado y actulizado los documentos correctamente'
        : completedCreate.length > 0
        ? 'Se han creado los documentos correctamente'
        : completedUpdate.length > 0
        ? 'Se han actulizado los documentos correctamente'
        : 'No se han podido actualizar o crear los documentos.';

    return {
      ids: completedCreate.length > 0 ? completedCreate.map((c) => c.id) : completedUpdate.map((c) => c.id),
      message,
    };
  }

  async getDocumentLayout(company: Company, id: number): Promise<ResponseSingleDTO<InvoicesDocuments>> {
    const { documentLayout } = await this.invoicesDocumentRepository.getSequenceAvailable(company, id);
    return new ResponseSingleDTO(plainToClass(InvoicesDocuments, documentLayout));
  }

  async updateDocumentStatus(id: string, company: Company, data: ActiveValidateDTO): Promise<ResponseMinimalDTO> {
    await this.invoicesDocumentRepository.getDocumentsByIds(company, [id]);
    await this.invoicesDocumentRepository.updateInvoiceDocument(id, data, company);
    return {
      message: 'El estado del documento se actualizo correctamente.',
    };
  }

  async createUpdateDocumentLayout(company: Company, id: number, data: InvoiceDocumentLayoutDTO) {
    const document = await this.invoicesDocumentRepository.getSequenceAvailable(company, id);
    await this.invoicesDocumentRepository.updateInvoiceDocument(document.id, { documentLayout: data }, company);
    return {
      message: `La configuracion ha sido guardada correctamente.`,
    };
  }
}
