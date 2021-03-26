import { EntityRepository, Repository } from 'typeorm';
import { InvoicesZone } from '../entities/InvoicesZone.entity';

@EntityRepository(InvoicesZone)
export class InvoicesZoneRepository extends Repository<InvoicesZone> {}
