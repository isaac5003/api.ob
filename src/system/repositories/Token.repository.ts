import { logDatabaseError } from 'src/_tools';
import { EntityRepository, Repository } from 'typeorm';
import { Token } from '../entities/Token.entity';

@EntityRepository(Token)
export class TokenRepository extends Repository<Token> {
  async deleteToken(authorization): Promise<boolean> {
    try {
      await this.delete({ active: authorization });
    } catch (error) {
      console.error(error);
      logDatabaseError('token', error);
    }
    return true;
  }
}
