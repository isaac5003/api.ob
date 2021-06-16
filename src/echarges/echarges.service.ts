import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/companies/entities/Company.entity';
import { CustomerRepository } from 'src/customers/repositories/Customer.repository';
import { InvoiceRepository } from 'src/invoices/repositories/Invoice.repository';
import { ResponseMinimalDTO } from 'src/_dtos/responseList.dto';
import { emailSender } from 'src/_tools';
import { EchargesBaseDTO } from './dtos/echarges-base.dto';
import { Echarges } from './entities/echarges.entity';
import { EchargesRepository } from './repositories/echarges.repository';
import { EchargesStatusRepository } from './repositories/echargesStatus.repository';

@Injectable()
export class EchargesService {
  constructor(
    @InjectRepository(EchargesRepository)
    private echargesRepository: EchargesRepository,

    @InjectRepository(InvoiceRepository)
    private invoiceRepository: InvoiceRepository,

    @InjectRepository(CustomerRepository)
    private customerRepository: CustomerRepository,

    @InjectRepository(EchargesStatusRepository)
    private echargesStatusRepository: EchargesStatusRepository,
  ) {}

  async getEcharge(company: Company, id: string, type = 'cliente'): Promise<Echarges> {
    const echarge = await this.echargesRepository.getEcharge(company, id);
    delete echarge.createdAt;

    return echarge;
  }

  async createRegister(data: Partial<EchargesBaseDTO>, company: Company): Promise<ResponseMinimalDTO> {
    let invoice;
    if (data.invoice) {
      invoice = await this.invoiceRepository.getInvoice(company, data.invoice as string);
    }
    const customer = await this.customerRepository.getCustomer(data.customer as string, company, 'cliente');
    const status = await this.echargesStatusRepository.getEchargeStatus(1);
    const dataToCreate = {
      customerName: data.invoice ? invoice.customer.name : customer.name,
      authorization: data.invoice ? invoice.authorization : data.authorization,
      sequence: data.invoice ? invoice.sequence : data.sequence,
      description: data.invoice ? invoice.invoiceDetails.map((d) => d.chargeDescription).join(' ') : data.description,
      echargeType: data.invoice ? invoice.documentType.code : 'CE',
      total: data.invoice ? invoice.ventaTotal : data.total,
      origin: data.invoice ? 'cfb8addb-541b-482f-8fa1-dfe5db03fdf4' : '09a5c668-ab54-441e-9fb2-d24b36ae202e',
      company: company,
      customer: customer,
      email: data.email,
      status: status,
      invoice: data.invoice ? invoice : null,
    };

    const echarge = await this.echargesRepository.createEcharge(dataToCreate);
    let message = 'Se ha creado el cobro correctamente';
    if (data.notify) {
      const email = await emailSender(data.email, 'OPENBOXCLOUD | Reinicio de contraseña.', 'content');
      if (!email.success) {
        message = `${message}, ${email.message}`;
      } else {
        message = `${message}, ${email.message}`;
        await this.echargesRepository.updateRegister({ status: 2 }, echarge.id, company);
      }
    }

    return {
      id: echarge.id,
      message,
    };
  }
}
