import { EntityRepository, Repository } from 'typeorm';
import { InvoicesStatus } from './InvoicesStatus.entity';

@EntityRepository(InvoicesStatus)
export class InvoicesStatusRepository extends Repository<InvoicesStatus> {}
