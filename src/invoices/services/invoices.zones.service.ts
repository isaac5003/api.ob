import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from '../../companies/entities/Company.entity';
import { FilterDTO } from '../../_dtos/filter.dto';
import { ResponseMinimalDTO } from '../../_dtos/responseList.dto';
import { ActiveValidateDTO } from '../dtos/invoice-active.dto';
import { InvoiceZonesDataDTO } from '../dtos/zones/invoice-data.dto';
import { InvoicesZones } from '../entities/invoices.zones.entity';
import { InvoicesZonesRepository } from '../repositories/invoices.zones.repository';

@Injectable()
export class InvoicesZonesService {
  constructor(
    @InjectRepository(InvoicesZonesRepository)
    private invoicesZoneRepository: InvoicesZonesRepository,
  ) {}

  async getInvoicesZones(
    company: Company,
    filter: Partial<FilterDTO>,
  ): Promise<{ data: InvoicesZones[]; count: number }> {
    return this.invoicesZoneRepository.getInvoicesZones(company, filter);
  }

  async createInvoicesZone(company: Company, data: InvoiceZonesDataDTO): Promise<ResponseMinimalDTO> {
    const invoiceZone = await this.invoicesZoneRepository.createInvoicesZone(company, data);
    return {
      id: invoiceZone.id,
      message: 'La zona se creo correctamente.',
    };
  }

  async updateInvoicesZone(
    id: string,
    company: Company,
    data: InvoiceZonesDataDTO | ActiveValidateDTO,
  ): Promise<ResponseMinimalDTO> {
    await this.invoicesZoneRepository.getInvoicesZone(company, id);
    await this.invoicesZoneRepository.updateInvoicesZone(id, company, data);
    return {
      message: 'La zona se actualizo correctamente',
    };
  }

  async deleteInvoicesZone(company: Company, id: string): Promise<ResponseMinimalDTO> {
    await this.invoicesZoneRepository.getInvoicesZone(company, id);
    const result = await this.invoicesZoneRepository.deleteInvoicesZone(company, id);
    return {
      message: result ? 'Se ha eliminado la zona correctamente' : 'No se ha podido eliminar zona',
    };
  }
}
