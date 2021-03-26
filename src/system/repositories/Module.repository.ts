import { EntityRepository, Repository } from 'typeorm';
import { Module } from '../entities/Module.entity';

@EntityRepository(Module)
export class ModuleRepository extends Repository<Module> {}
