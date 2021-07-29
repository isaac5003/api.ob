import { logDatabaseError } from '../../_tools';
import { EntityRepository, Repository } from 'typeorm';
import { PersonType } from '../entities/customers.personType.entity';

const reponame = 'tipo de cliente';
@EntityRepository(PersonType)
export class PersonTypeRepository extends Repository<PersonType> {
  async getPersonTypes(): Promise<{ data: PersonType[]; count: number }> {
    let types: PersonType[];
    try {
      types = await this.find();
    } catch (error) {
      logDatabaseError(reponame, error);
    }
    return {
      data: types,
      count: types.length,
    };
  }
}
