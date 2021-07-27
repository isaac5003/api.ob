import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { User } from 'src/auth/entities/User.entity';
import { Company } from 'src/companies/entities/Company.entity';
import { CustomerRepository } from 'src/customers/repositories/Customer.repository';
import { Invoices } from 'src/invoices/entities/Invoices.entity';
import { InvoiceRepository } from 'src/invoices/repositories/Invoice.repository';
import { ResponseMinimalDTO, ResponseSingleDTO } from 'src/_dtos/responseList.dto';
import { emailSender } from 'src/_tools';
import { EchargesFilterDTO } from './dtos/echages-filter.dto';
import { EchargesBaseDTO } from './dtos/echarges-base.dto';
import { EchargesActiveDTO } from './dtos/validate/echarge-active.vdto';
import { Echarges } from './entities/echarges.entity';
import { EchargesStatus } from './entities/echargesStatus.entity';
import { EchargesRepository } from './repositories/echarges.repository';
import { EchargesRequestRepository } from './repositories/echargesRequest.repository';
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

    @InjectRepository(EchargesRequestRepository)
    private echargesRequestRepository: EchargesRequestRepository,
  ) {}

  async getEcharges(company: Company, filter: EchargesFilterDTO): Promise<{ data: Echarges[]; count: number }> {
    return await this.echargesRepository.getEcharges(company, filter);
  }

  async getEcharge(company: Company, id: string): Promise<ResponseSingleDTO<Echarges>> {
    const echarge = await this.echargesRepository.getEcharge(company, id);
    const data = {
      ...echarge,
      customer: {
        id: echarge.customer.id,
        name: echarge.customer.name,
        shortName: echarge.customer.name,
      },
      invoice: echarge.invoice ? echarge.invoice.id : null,
    };
    delete data.createdAt;
    return new ResponseSingleDTO(plainToClass(Echarges, data));
  }

  async createRegister(data: Partial<EchargesBaseDTO>, company: Company, user: User): Promise<ResponseMinimalDTO> {
    let invoice;
    let description = '';
    let customer;
    if (data.invoice) {
      invoice = await this.invoiceRepository.getInvoice(company, data.invoice as string);
      for (const d of invoice.invoiceDetails) {
        description += `(${d.quantity}) - ${d.chargeDescription}\n`;
      }
      customer = await this.customerRepository.getCustomer(data.customer as string, company, 'cliente');
    }

    const status = await this.echargesStatusRepository.getEchargeStatus(1);

    const dataToCreate = {
      customerName: data.invoice ? invoice.customer.name : customer.name,
      authorization: data.invoice ? invoice.authorization : data.authorization,
      sequence: data.invoice ? invoice.sequence : data.sequence,
      description: data.invoice ? description : data.description,
      echargeType: data.invoice ? invoice.documentType.code : 'CE',
      total: data.invoice ? invoice.ventaTotal : data.total,
      origin: data.invoice ? 'cfb8addb-541b-482f-8fa1-dfe5db03fdf4' : '09a5c668-ab54-441e-9fb2-d24b36ae202e',
      company: company,
      customer: data.invoice ? invoice.customer : customer,
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
        await this.echargesRequestRepository.createRequest(user, echarge);
      }
    }

    return {
      id: echarge.id,
      message,
    };
  }

  async updateEcharge(
    id: string,
    data: Partial<EchargesBaseDTO>,
    company: Company,
    user: User,
  ): Promise<ResponseMinimalDTO> {
    const echarge = await this.echargesRepository.getEcharge(company, id);
    if (echarge.origin != '09a5c668-ab54-441e-9fb2-d24b36ae202e') {
      throw new ForbiddenException('No puedes editar este cobro, porque fue generado desde otro modulo.');
    }
    let invoice;
    let description = '';
    if (data.invoice) {
      invoice = await this.invoiceRepository.getInvoice(company, data.invoice as string);
      for (const d of invoice.invoiceDetails) {
        description += `(${d.quantity}) - ${d.chargeDescription}\n`;
      }
    }
    const customer = await this.customerRepository.getCustomer(data.customer as string, company, 'cliente');

    const dataToUpdate = {
      customerName: data.invoice ? invoice.customer.name : customer.name,
      authorization: data.invoice ? invoice.authorization : data.authorization,
      sequence: data.invoice ? invoice.sequence : data.sequence,
      description: data.invoice ? description : data.description,
      echargeType: data.invoice ? invoice.documentType.code : 'CE',
      total: data.invoice ? invoice.ventaTotal : data.total,
      origin: data.invoice ? 'cfb8addb-541b-482f-8fa1-dfe5db03fdf4' : '09a5c668-ab54-441e-9fb2-d24b36ae202e',
      company: company,
      customer: customer,
      email: data.email,
      invoice: data.invoice ? invoice : null,
    };
    const updated = await this.echargesRepository.updateRegister(dataToUpdate, id, company);

    if (updated.affected == 0) {
      throw new BadRequestException('No se ha podido actulizar el cobro electronico.');
    }
    let message = 'Se ha actulizado correctamente el cobro electronico';
    const email = await emailSender(data.email, 'OPENBOXCLOUD | Notificacion de edicion.', 'content');
    if (!email.success) {
      message = `${message}, ${email.message}`;
    } else {
      message = `${message}, ${email.message}`;
      await this.echargesRequestRepository.createRequest(user, echarge);
    }

    return {
      message,
    };
  }

  async changeActive(id: string, company: Company, data: EchargesActiveDTO): Promise<ResponseMinimalDTO> {
    const echarge = await this.echargesRepository.getEcharge(company, id);

    if (echarge.status.id == 3) {
      throw new BadRequestException(
        'No puedes desactivar el cobro electronico ya que posee un estado que no lo permite.',
      );
    }
    if (data.status == 2 && echarge.request.length == 0) {
      data.status = 1;
    }
    const update = await this.echargesRepository.updateRegister(data, id, company);

    if (update.affected == 0) {
      throw new BadRequestException('No se ha podido actulizar el cobro electronico.');
    }
    return {
      message: 'Se ha actulizado el cobro electronico correctamente.',
    };
  }

  async sendEcharge(id: string, company: Company, user: User): Promise<ResponseMinimalDTO> {
    let message = '';

    const echarge = await this.echargesRepository.getEcharge(company, id);
    const email = await emailSender(echarge.email, 'OPENBOXCLOUD | Reinicio de contraseña.', 'content');
    if (!email.success) {
      throw new BadRequestException(`${email.message}`);
    } else {
      message = email.message;
      await this.echargesRepository.updateRegister({ status: 2 }, echarge.id, company);
      await this.echargesRequestRepository.createRequest(user, echarge);
    }

    return {
      message,
    };
  }

  async getEchargesStatuses(): Promise<EchargesStatus[]> {
    return await this.echargesStatusRepository.getEchargeStatuses();
  }
}
