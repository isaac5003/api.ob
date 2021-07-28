import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from '../../companies/entities/Company.entity';
import { ResponseMinimalDTO } from '../../_dtos/responseList.dto';
import { InvoicesStatuses } from '../entities/invoices.statuses.entity';
import { InvoiceRepository } from '../repositories/invoices.repository';
import { InvoicesStatusesRepository } from '../repositories/invoices.statuses.repository';

@Injectable()
export class InvoicesStatusService {
  constructor(
    @InjectRepository(InvoicesStatusesRepository)
    private invoiceStatusesRepository: InvoicesStatusesRepository,

    @InjectRepository(InvoiceRepository)
    private invoiceRepository: InvoiceRepository,
  ) {}

  async getInvoicesStatuses(): Promise<{ data: InvoicesStatuses[]; count: number }> {
    return this.invoiceStatusesRepository.getInvoicesStatuses();
  }

  async updateInvoicesStatus(company: Company, id: string, type: string): Promise<ResponseMinimalDTO> {
    const invoice = await this.invoiceRepository.getInvoice(company, id);

    let status: InvoicesStatuses;
    let statuses = [];

    switch (type) {
      case 'void':
        status = await this.invoiceStatusesRepository.getInvoicesStatus(3);
        statuses = [1, 2];
        break;
      case 'printed':
        status = await this.invoiceStatusesRepository.getInvoicesStatus(2);
        statuses = [1, 2];
        break;
      case 'paid':
        status = await this.invoiceStatusesRepository.getInvoicesStatus(5);
        statuses = [2];
        break;
      case 'reverse':
        let newStatus = null;
        switch (invoice.status.id) {
          case 2:
            newStatus = 1;
            break;
          case 3:
            newStatus = 2;
            break;
          case 5:
            newStatus = 2;
            break;
        }
        status = await this.invoiceStatusesRepository.getInvoicesStatus(newStatus);
        statuses = [2, 3, 5];
        break;
    }

    if (!statuses.includes(invoice.status.id)) {
      throw new BadRequestException('La venta tiene un estado que no permite esta acción.');
    }

    await this.invoiceRepository.updateInvoice([id], { status: status.id });

    return {
      message:
        type == 'reverse'
          ? `La venta se revertio correctamente, ha sido marcada como ${status.name.toLowerCase()}.`
          : `La venta ha sido marcada como ${status.name.toLowerCase()} correctamente.`,
    };
  }
}
