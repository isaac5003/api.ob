import { Body, Controller, Get, Param, Put, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { plainToClass } from 'class-transformer';
import { GetAuthData } from 'src/auth/get-auth-data.decorator';
import { Company } from 'src/companies/entities/Company.entity';
import { ResponseListDTO, ResponseMinimalDTO, ResponseSingleDTO } from 'src/_dtos/responseList.dto';
import { InvoiceDocumentLayoutDTO } from '../dtos/documents/invoice-document-layout.dto';
import { InvoiceDocumentUpdateDTO } from '../dtos/documents/invoice-document-update.dto';
import { DocumentFilterDTO } from '../dtos/documents/invoice-documnet-filter.dto';
import { ActiveValidateDTO } from '../dtos/invoice-active.dto';
import { InvoicesDocument } from '../entities/InvoicesDocument.entity';
import { InvoicesDocumentsService } from '../services/invoices.documents.service';

@Controller('/documents')
@UseGuards(AuthGuard())
export class InvoicesDocumentsController {
  constructor(private invoiceDocuments: InvoicesDocumentsService) {}

  @Get('/')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getInvoiceDocuments(
    @GetAuthData('company') company: Company,
    @Query() filter: DocumentFilterDTO,
  ): Promise<ResponseListDTO<InvoicesDocument, number, number, number>> {
    const { data, count } = await await this.invoiceDocuments.getDocuments(company, filter);
    return new ResponseListDTO(plainToClass(InvoicesDocument, data), count, filter.page, filter.limit);
  }

  @Get('/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getInvoiceDocument(
    @GetAuthData('company') company: Company,
    @Param('id') id: string,
  ): Promise<ResponseSingleDTO<InvoicesDocument>> {
    return await this.invoiceDocuments.getDocument(company, id);
  }

  @Put('/')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateInvoiceDocument(
    @GetAuthData('company') company: Company,
    @Body('documents') data: InvoiceDocumentUpdateDTO[],
  ): Promise<ResponseMinimalDTO> {
    return await this.invoiceDocuments.createUpdateDocument(company, data);
  }

  @Get('/:id/layout')
  async getDocumentLayout(
    @GetAuthData('company') company: Company,
    @Param('id') id: number,
  ): Promise<ResponseSingleDTO<InvoicesDocument>> {
    return await this.invoiceDocuments.getDocumentLayout(company, id);
  }

  @Put('/status/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateInvoiceDocumentStatus(
    @GetAuthData('company') company: Company,
    @Body() data: ActiveValidateDTO,
    @Param('id') id: string,
  ): Promise<ResponseMinimalDTO> {
    return await this.invoiceDocuments.updateDocumentStatus(id, company, data);
  }

  @Put('/documentlayout/:id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createUpdateLayout(
    @Param('id') id: string,
    @Body() data: InvoiceDocumentLayoutDTO,
    @GetAuthData('company') company: Company,
  ): Promise<ResponseMinimalDTO> {
    return this.invoiceDocuments.createUpdateDocumentLayout(company, parseInt(id), data);
  }
}
