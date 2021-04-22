import { Company } from 'src/companies/entities/Company.entity';
import { FilterDTO } from 'src/_dtos/filter.dto';
import { logDatabaseError } from 'src/_tools';
import { EntityRepository, Repository } from 'typeorm';
import { InvoiceAuxiliarUpdateDTO } from '../dtos/invoice-auxiliar-update.dto';
import { PaymentConditionCreateDTO } from '../dtos/invoice-paymentcondition-data.dto';
import { InvoicesPaymentsCondition } from '../entities/InvoicesPaymentsCondition.entity';

const reponame = 'condiciones de pago';
@EntityRepository(InvoicesPaymentsCondition)
export class InvoicesPaymentsConditionRepository extends Repository<InvoicesPaymentsCondition> {
  async getInvoicePaymentConditions(
    company: Company,
    filter: Partial<FilterDTO>,
  ): Promise<InvoicesPaymentsCondition[]> {
    const { search, active } = filter;

    try {
      const query = this.createQueryBuilder('pc')
        .where({ company })
        .orderBy('pc.createdAt', 'DESC');

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

  async getInvoicePaymentCondition(
    id: string,
    company: Company,
  ): Promise<InvoicesPaymentsCondition> {
    let invoicesPaymantsCondition: InvoicesPaymentsCondition;

    try {
      invoicesPaymantsCondition = await this.findOneOrFail({ id, company });
    } catch (error) {
      logDatabaseError(reponame, error);
    }
    return invoicesPaymantsCondition;
  }

  async createInvoicePaymentCondition(
    company: Company,
    data: PaymentConditionCreateDTO,
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

  async updateInvoicePaymentCondition(
    id: string,
    company: Company,
    data: Partial<InvoiceAuxiliarUpdateDTO>,
  ): Promise<any> {
    try {
      const invoicesPaymantsCondition = this.update({ id, company }, data);
      return invoicesPaymantsCondition;
    } catch (error) {
      logDatabaseError(reponame, error);
    }
  }

  async deleteInvoicePaymentCondition(
    company: Company,
    id: string,
  ): Promise<boolean> {
    try {
      await this.delete({ id, company });
    } catch (error) {
      console.error(error);

      logDatabaseError(reponame, error);
    }
    return true;
  }
}
