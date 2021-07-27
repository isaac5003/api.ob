import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from 'src/companies/entities/Company.entity';
import { FilterDTO } from 'src/_dtos/filter.dto';
import { ResponseMinimalDTO } from 'src/_dtos/responseList.dto';
import { ActiveValidateDTO } from '../dtos/invoice-active.dto';
import { InvoicePaymentConditionDataDTO } from '../dtos/payment-condition/invoice-data.dto';
import { InvoicesPaymentsCondition } from '../entities/InvoicesPaymentsCondition.entity';
import { InvoicesPaymentsConditionsRepository } from '../repositories/invoicesPaymentsConditions.repository';

@Injectable()
export class InvoicesPaymentsConditionsService {
  constructor(
    @InjectRepository(InvoicesPaymentsConditionsRepository)
    private invoicesPaymentsConditionRepository: InvoicesPaymentsConditionsRepository,
  ) {}

  async getInvoicesPaymentConditions(
    company: Company,
    filter: FilterDTO,
  ): Promise<{ data: InvoicesPaymentsCondition[]; count: number }> {
    return this.invoicesPaymentsConditionRepository.getInvoicesPaymentConditions(company, filter);
  }

  async createInvoicesPaymentCondition(
    company: Company,
    data: InvoicePaymentConditionDataDTO,
  ): Promise<ResponseMinimalDTO> {
    const invoicePayment = await this.invoicesPaymentsConditionRepository.createInvoicesPaymentCondition(company, data);
    return {
      id: invoicePayment.id,
      message: 'La condicion de pago se creo correctamente.',
    };
  }

  async updateInvoicesPaymentCondition(
    id: string,
    company: Company,
    data: InvoicePaymentConditionDataDTO | ActiveValidateDTO,
  ): Promise<ResponseMinimalDTO> {
    await this.invoicesPaymentsConditionRepository.getInvoicesPaymentCondition(id, company);

    await this.invoicesPaymentsConditionRepository.updateInvoicesPaymentCondition(id, company, data);
    return {
      message: 'La condicion de pago se actualizo correctamente',
    };
  }

  async deleteInvoicesPaymentCondition(company: Company, id: string): Promise<ResponseMinimalDTO> {
    await this.invoicesPaymentsConditionRepository.getInvoicesPaymentCondition(id, company);
    const result = await this.invoicesPaymentsConditionRepository.deleteInvoicesPaymentCondition(company, id);
    return {
      message: result
        ? 'Se ha eliminado la condicion de pago correctamente correctamente'
        : 'No se ha podido eliminar condicion de pago correctamente',
    };
  }
}
