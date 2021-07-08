import { logDatabaseError } from 'src/_tools';
import { EntityRepository, Repository } from 'typeorm';
import { InvoicesEntriesRecurrency } from '../entities/InvoicesEntriesRecurrency.entity';

const reponame = 'recurrencia';
@EntityRepository(InvoicesEntriesRecurrency)
export class InvoicesEntriesRecurrencyRepository extends Repository<InvoicesEntriesRecurrency> {
  async getInvoicesEntriesRecurrencies(): Promise<{ data: InvoicesEntriesRecurrency[]; count: number }> {
    let recurrencies: InvoicesEntriesRecurrency[];
    try {
      recurrencies = await this.find({
        order: {
          createdAt: 'DESC',
        },
      });
    } catch (error) {
      logDatabaseError(reponame, error);
    }
    return { data: recurrencies, count: recurrencies.length };
  }
}
