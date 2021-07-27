import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/companies/entities/Company.entity';
import { FilterDTO } from 'src/_dtos/filter.dto';
import { ResponseMinimalDTO } from 'src/_dtos/responseList.dto';
import { ActiveValidateDTO } from '../dtos/invoice-active.dto';
import { InvoiceSellerDataDTO } from '../dtos/sellers/invoice-data.dto';
import { InvoicesSeller } from '../entities/InvoicesSeller.entity';
import { InvoicesSellerRepository } from '../repositories/InvoicesSeller.repository';
import { InvoicesZoneRepository } from '../repositories/InvoicesZone.repository';

@Injectable()
export class InvoicesSellerService {
  constructor(
    @InjectRepository(InvoicesZoneRepository)
    private invoicesZoneRepository: InvoicesZoneRepository,

    @InjectRepository(InvoicesSellerRepository)
    private invoiceSellerRepository: InvoicesSellerRepository,
  ) {}

  async getInvoicesSellers(company: Company, filter: FilterDTO): Promise<{ data: InvoicesSeller[]; count: number }> {
    return this.invoiceSellerRepository.getInvoicesSellers(company, filter);
  }

  async createInvoicesSeller(company: Company, data: InvoiceSellerDataDTO): Promise<ResponseMinimalDTO> {
    const invoicesZone = await this.invoicesZoneRepository.getInvoicesZone(
      company,
      (data.invoicesZone as unknown) as string,
    );
    const seller = await this.invoiceSellerRepository.createInvoicesSeller(company, { ...data, invoicesZone });
    return {
      id: seller.id,
      message: 'El vendedor se ha creado correctamente',
    };
  }

  async updateInvoicesSeller(
    id: string,
    company: Company,
    data: InvoiceSellerDataDTO | ActiveValidateDTO,
  ): Promise<ResponseMinimalDTO> {
    await this.invoiceSellerRepository.getInvoicesSeller(company, id);
    await this.invoiceSellerRepository.updateInvoicesSeller(id, company, data);

    return {
      message: 'El vendedor se actualizo correctamente.',
    };
  }

  async deleteInvoicesSeller(company: Company, id: string): Promise<ResponseMinimalDTO> {
    await this.invoiceSellerRepository.getInvoicesSeller(company, id);

    const result = await this.invoiceSellerRepository.deleteInvoicesSeller(company, id);

    return {
      message: result ? 'Se ha eliminado el vendedor correctamente' : 'No se ha podido eliminar el vendedor',
    };
  }
}
