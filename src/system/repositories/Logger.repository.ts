import { EntityRepository, Repository } from 'typeorm';
import { Logger } from '../entities/Logger.entity';

@EntityRepository(Logger)
export class LoggerRepository extends Repository<Logger> {}
