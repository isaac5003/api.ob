import { EntityRepository, Repository } from 'typeorm';
import { Access } from '../entities/Access.entity';

@EntityRepository(Access)
export class AccessRepository extends Repository<Access> {
  async getAccessByProfileId(profile): Promise<Access> {
    return this.createQueryBuilder('a')
      .leftJoinAndSelect('a.company', 'c')
      .leftJoinAndSelect('a.branch', 'b')
      .where('a.profile = :profile', { profile })
      .getOne();
  }
}
