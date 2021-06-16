import { User } from 'src/auth/entities/User.entity';
import { logDatabaseError } from 'src/_tools';
import { EntityRepository, Repository } from 'typeorm';
import { Echarges } from '../entities/echarges.entity';
import { EchargesRequest } from '../entities/echargesRequest.entity';

const reponame = 'solicitud';
@EntityRepository(EchargesRequest)
export class EchargesRequestRepository extends Repository<EchargesRequest> {
  async createRequest(user: User, echarge: Echarges): Promise<EchargesRequest> {
    let response;
    try {
      const request = this.create({ user, echarges: echarge });
      response = await this.save(request);
    } catch (error) {
      console.error(error);
      logDatabaseError(reponame, error);
    }
    return await response;
  }
}
