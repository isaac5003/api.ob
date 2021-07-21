import { logDatabaseError } from 'src/_tools';
import { EntityRepository, Repository } from 'typeorm';
import { Module } from '../entities/Module.entity';

@EntityRepository(Module)
export class ModuleRepository extends Repository<Module> {
  async getModules(): Promise<Module[]> {
    let modules: Module[];

    try {
      modules = await this.find();
    } catch (error) {
      console.error(error);
      logDatabaseError('modulos', error);
    }
    return modules;
  }

  async getModule(id: string): Promise<Module> {
    let module: Module;

    try {
      module = await this.findOneOrFail(id);
    } catch (error) {
      console.error(error);
      logDatabaseError('modulos', error);
    }
    return module;
  }
}
