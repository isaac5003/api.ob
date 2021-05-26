import { logDatabaseError } from '../../_tools';
import { EntityRepository, Repository } from 'typeorm';
import { Recovery } from '../entities/Recovery.entity';

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
}
