import { EntityRepository, Repository } from 'typeorm';
import { Token } from '../entities/Token.entity';

@EntityRepository(Token)
export class TokenRepository extends Repository<Token> {}
