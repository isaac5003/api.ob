import { EntityRepository, Repository } from 'typeorm';
import { InvoicesEntriesRecurrency } from '../entities/InvoicesEntriesRecurrency.entity';

const reponame = 'recurrencia';
@EntityRepository(InvoicesEntriesRecurrency)
export class InvoicesEntriesRecurrencyRepository extends Repository<InvoicesEntriesRecurrency> {}
