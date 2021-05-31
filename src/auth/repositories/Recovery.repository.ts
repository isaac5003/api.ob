import { logDatabaseError } from '../../_tools';
import { EntityRepository, Repository } from 'typeorm';
import { Recovery } from '../entities/Recovery.entity';
import { TokenDTO } from '../dtos/auth-token.dto';

@EntityRepository(Recovery)
export class RecoveryRepository extends Repository<Recovery> {
  async createToken(data: any): Promise<Recovery> {
    let response; //Recovery
    try {
      const token = this.create(data);
      response = await this.save(token);
    } catch (error) {
      console.error(error);

      logDatabaseError('recovery', error);
    }
    return await response;
  }

  async getTokenByToken(token: string): Promise<Recovery> {
    let tokenData: Recovery;
    try {
      tokenData = await this.findOneOrFail({
        where: { token },
        join: {
          alias: 'token',
          leftJoinAndSelect: {
            user: 'token.user',
          },
        },
      });
    } catch (error) {
      console.error(error);

      logDatabaseError('recovery', error);
    }
    return tokenData;
  }

  async updateRecovery(id: string, data: Partial<Recovery>): Promise<any> {
    try {
      return this.update({ id }, data);
    } catch (error) {
      console.error(error);
      logDatabaseError('recovery', error);
    }
  }
}
