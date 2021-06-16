import { EntityRepository, Repository } from 'typeorm';
import { EchargesRequest } from '../entities/echargesRequest.entity';

@EntityRepository(EchargesRequest)
export class EchargesRequestRepository extends Repository<EchargesRequest> {}
