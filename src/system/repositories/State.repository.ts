import { EntityRepository, Repository } from 'typeorm';
import { State } from '../entities/State.entity';

@EntityRepository(State)
export class StateRepository extends Repository<State> {}
