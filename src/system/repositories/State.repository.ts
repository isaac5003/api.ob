import { logDatabaseError } from 'src/_tools';
import { EntityRepository, Repository } from 'typeorm';
import { State } from '../entities/State.entity';

@EntityRepository(State)
export class StateRepository extends Repository<State> {
  async getStates(): Promise<State[]> {
    let state: State[];
    const leftJoinAndSelect = {
      c: 's.country',
    };

    try {
      state = await this.find({
        join: {
          alias: 's',
          leftJoinAndSelect,
        },
      });
    } catch (error) {
      console.error(error);
      logDatabaseError('departamentos', error);
    }
    return state;
  }
}
