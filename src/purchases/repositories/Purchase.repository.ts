import { Company } from '../../companies/entities/Company.entity';
import { logDatabaseError } from '../../_tools';
import { EntityRepository, Repository } from 'typeorm';
import { Purchase } from '../entities/Purchase.entity';

const reponame = 'documento';
@EntityRepository(Purchase)
export class PurchaseRepository extends Repository<Purchase> {
  async getPurchase(company: Company, id: string, joins: string[] = []): Promise<Purchase> {
    let purchase: Purchase;

    try {
      purchase = await this.findOneOrFail(
        { id, company },
        {
          join: {
            alias: 'p',
          },
        },
      );
    } catch (error) {
      logDatabaseError(reponame, error);
    }
    return purchase;
  }
}
