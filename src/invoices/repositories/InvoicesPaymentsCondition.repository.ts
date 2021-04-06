import { Company } from 'src/companies/entities/Company.entity';
import { logDatabaseError } from 'src/_tools';
import { EntityRepository, Repository } from 'typeorm';
import { InvoicesPaymentsCondition } from '../entities/InvoicesPaymentsCondition.entity';

const reponame = 'condiciones de pago';
@EntityRepository(InvoicesPaymentsCondition)
export class InvoicesPaymentsConditionRepository extends Repository<InvoicesPaymentsCondition> {
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
}
