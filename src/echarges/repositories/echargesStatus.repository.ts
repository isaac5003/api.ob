import { logDatabaseError } from 'src/_tools';
import { EntityRepository, Repository } from 'typeorm';
import { EchargesStatus } from '../entities/echargesStatus.entity';

const reponame = 'estado de cobro';
@EntityRepository(EchargesStatus)
export class EchargesStatusRepository extends Repository<EchargesStatus> {
  async getEchargeStatus(id: number): Promise<EchargesStatus> {
    let echargesStatus: EchargesStatus;
    try {
      echargesStatus = await this.findOneOrFail({ id });
    } catch (error) {
      logDatabaseError(reponame, error);
    }
    return echargesStatus;
  }

  async getEchargeStatuses(): Promise<EchargesStatus[]> {
    let echargesStatuses: EchargesStatus[];
    try {
      echargesStatuses = await this.find();
    } catch (error) {
      logDatabaseError(reponame, error);
    }

    return echargesStatuses;
  }
}
