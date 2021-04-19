import { Company } from 'src/companies/entities/Company.entity';
import { FilterDTO } from 'src/_dtos/filter.dto';
import { logDatabaseError } from 'src/_tools';
import { EntityRepository, Repository } from 'typeorm';
import { ActiveValidateDTO } from '../dtos/invoice-active.dto';
import { InvoicePaymentConditionDataDTO } from '../dtos/payment-condition/invoice-data.dto';
import { InvoicesPaymentsCondition } from '../entities/InvoicesPaymentsCondition.entity';

const reponame = 'condiciones de pago';
@EntityRepository(InvoicesPaymentsCondition)
export class InvoicesPaymentsConditionRepository extends Repository<InvoicesPaymentsCondition> {
  async getInvoicesPaymentConditions(company: Company, filter: FilterDTO): Promise<InvoicesPaymentsCondition[]> {
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
        });
      }

      return await query.getMany();
    } catch (error) {
      console.log(error);
      logDatabaseError(reponame, error);
    }
  }

  async createInvoicesPaymentCondition(
    company: Company,
    data: InvoicePaymentConditionDataDTO,
  ): Promise<InvoicesPaymentsCondition> {
    let response: InvoicesPaymentsCondition;
    try {
      const invoicesPaymantsCondition = this.create({ company, ...data });
      response = await this.save(invoicesPaymantsCondition);
    } catch (error) {
      console.error(error);
      logDatabaseError(reponame, error);
    }
    return await response;
  }

  async getInvoicesPaymentCondition(id: string, company: Company): Promise<InvoicesPaymentsCondition> {
    let invoicesPaymantsCondition: InvoicesPaymentsCondition;

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
  ): Promise<InvoicesPaymentsCondition> {
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
