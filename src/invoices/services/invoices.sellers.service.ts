import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/companies/entities/Company.entity';
import { FilterDTO } from 'src/_dtos/filter.dto';
import { ResponseMinimalDTO } from 'src/_dtos/responseList.dto';
import { ActiveValidateDTO } from '../dtos/invoice-active.dto';
import { InvoiceSellerDataDTO } from '../dtos/sellers/invoice-data.dto';
import { InvoicesSellers } from '../entities/invoices.sellers.entity';
import { InvoicesSellersRepository } from '../repositories/invoices.sellers.repository';
import { InvoicesZonesRepository } from '../repositories/invoices.zones.repository';

@Injectable()
export class InvoicesSellersService {
  constructor(
    @InjectRepository(InvoicesZonesRepository)
    private invoicesZoneRepository: InvoicesZonesRepository,

    @InjectRepository(InvoicesSellersRepository)
    private invoicesSellersRepository: InvoicesSellersRepository,
  ) {}

  async getInvoicesSellers(company: Company, filter: FilterDTO): Promise<{ data: InvoicesSellers[]; count: number }> {
    return this.invoicesSellersRepository.getInvoicesSellers(company, filter);
  }

  async createInvoicesSeller(company: Company, data: InvoiceSellerDataDTO): Promise<ResponseMinimalDTO> {
    const invoicesZone = await this.invoicesZoneRepository.getInvoicesZone(
      company,
      data.invoicesZone as unknown as string,
    );
    const seller = await this.invoicesSellersRepository.createInvoicesSeller(company, { ...data, invoicesZone });
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
    await this.invoicesSellersRepository.getInvoicesSeller(company, id);
    await this.invoicesSellersRepository.updateInvoicesSeller(id, company, data);

    return {
      message: 'El vendedor se actualizo correctamente.',
    };
  }

  async deleteInvoicesSeller(company: Company, id: string): Promise<ResponseMinimalDTO> {
    await this.invoicesSellersRepository.getInvoicesSeller(company, id);

    const result = await this.invoicesSellersRepository.deleteInvoicesSeller(company, id);

    return {
      message: result ? 'Se ha eliminado el vendedor correctamente' : 'No se ha podido eliminar el vendedor',
    };
  }
}
