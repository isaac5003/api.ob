import { Company } from '../../companies/entities/Company.entity';
import { FilterDTO } from '../../_dtos/filter.dto';
import { logDatabaseError } from '../../_tools';
import { EntityRepository, Repository } from 'typeorm';
import { ActiveValidateDTO } from '../dtos/invoice-active.dto';
import { InvoicePaymentConditionDataDTO } from '../dtos/payment-condition/invoice-data.dto';
import { InvoicesPaymentsConditions } from '../entities/invoices.paymentsConditions.entity';

const reponame = 'condiciones de pago';
@EntityRepository(InvoicesPaymentsConditions)
export class InvoicesPaymentsConditionsRepository extends Repository<InvoicesPaymentsConditions> {
  async getInvoicesPaymentConditions(
    company: Company,
    filter: FilterDTO,
  ): Promise<{ data: InvoicesPaymentsConditions[]; count: number }> {
    const { search, active } = filter;

    try {
      const query = this.createQueryBuilder('pc').where({ company }).orderBy('pc.createdAt', 'DESC');

      // filter by status
      if (active || active == false) {
        query.andWhere('pc.active = :active', { active });
      }

      // filter by search value
      if (search) {
        query.andWhere('LOWER(pc.name) LIKE :search', {
          search: `%${search}%`,
          company: company.id,
        });
      }

      const conditions = await query.getMany();
      return { data: conditions, count: conditions.length };
    } catch (error) {
      console.log(error);
      logDatabaseError(reponame, error);
    }
  }

  async createInvoicesPaymentCondition(
    company: Company,
    data: InvoicePaymentConditionDataDTO,
  ): Promise<InvoicesPaymentsConditions> {
    let response: InvoicesPaymentsConditions;
    try {
      const invoicesPaymantsCondition = this.create({ company, ...data });
      response = await this.save(invoicesPaymantsCondition);
    } catch (error) {
      console.error(error);
      logDatabaseError(reponame, error);
    }
    return await response;
  }

  async getInvoicesPaymentCondition(id: string, company: Company): Promise<InvoicesPaymentsConditions> {
    let invoicesPaymantsCondition: InvoicesPaymentsConditions;

    try {
      invoicesPaymantsCondition = await this.findOneOrFail({ id, company });
    } catch (error) {
      logDatabaseError(reponame, error);
    }
    return invoicesPaymantsCondition;
  }

  async updateInvoicesPaymentCondition(
    id: string,
    company: Company,
    data: InvoicePaymentConditionDataDTO | ActiveValidateDTO,
  ): Promise<InvoicesPaymentsConditions> {
    try {
      this.update({ id, company }, data);
      return this.findOne({ id, company });
    } catch (error) {
      logDatabaseError(reponame, error);
    }
  }

  async deleteInvoicesPaymentCondition(company: Company, id: string): Promise<boolean> {
    try {
      await this.delete({ id, company });
    } catch (error) {
      console.error(error);
      logDatabaseError(reponame, error);
    }
    return true;
  }
}
