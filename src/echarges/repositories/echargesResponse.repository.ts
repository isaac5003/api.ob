import { EntityRepository, Repository } from 'typeorm';
import { EchargesResponses } from '../entities/echargesResponses.entity';

@EntityRepository(EchargesResponses)
export class EchargesResponsesRepository extends Repository<EchargesResponses> {}
