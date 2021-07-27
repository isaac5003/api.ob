import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from '../../companies/entities/Company.entity';
import { ResponseMinimalDTO } from '../../_dtos/responseList.dto';
import { InvoicesStatus } from '../entities/InvoicesStatus.entity';
import { InvoiceRepository } from '../repositories/invoices.repository';
import { InvoicesStatusRepository } from '../repositories/InvoicesStatus.repository';

@Injectable()
export class InvoicesStatusService {
  constructor(
    @InjectRepository(InvoicesStatusRepository)
    private invoiceStatusRepository: InvoicesStatusRepository,

    @InjectRepository(InvoiceRepository)
    private invoiceRepository: InvoiceRepository,
  ) {}

  async getInvoicesStatuses(): Promise<{ data: InvoicesStatus[]; count: number }> {
    return this.invoiceStatusRepository.getInvoicesStatuses();
  }

  async updateInvoicesStatus(company: Company, id: string, type: string): Promise<ResponseMinimalDTO> {
    const invoice = await this.invoiceRepository.getInvoice(company, id);

    let status: InvoicesStatus;
    let statuses = [];

    switch (type) {
      case 'void':
        status = await this.invoiceStatusRepository.getInvoicesStatus(3);
        statuses = [1, 2];
        break;
      case 'printed':
        status = await this.invoiceStatusRepository.getInvoicesStatus(2);
        statuses = [1, 2];
        break;
      case 'paid':
        status = await this.invoiceStatusRepository.getInvoicesStatus(5);
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
        status = await this.invoiceStatusRepository.getInvoicesStatus(newStatus);
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
