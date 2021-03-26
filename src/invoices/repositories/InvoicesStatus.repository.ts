import { EntityRepository, Repository } from 'typeorm';
import { InvoicesStatus } from '../entities/InvoicesStatus.entity';

@EntityRepository(InvoicesStatus)
export class InvoicesStatusRepository extends Repository<InvoicesStatus> {}
