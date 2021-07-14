import { Company } from '../../companies/entities/Company.entity';
import { EntityRepository, Repository } from 'typeorm';
import { InvoicesIntegrations } from '../entities/InvoicesIntegrations.entity';
import { logDatabaseError } from 'src/_tools';

const reponame = 'integraciones de venta';

@EntityRepository(InvoicesIntegrations)
export class InvoicesIntegrationsRepository extends Repository<InvoicesIntegrations> {
  /**
   *
   * Metodo utilizado para obtener las configuraciones de integraciones de invoices
   * @param company --Comapnia en la que esta logado el ususario que solicita el metodo
   * @returns
   */
  async getInvoicesIntegrations(company: Company): Promise<InvoicesIntegrations[]> {
    let settingIntegrations: InvoicesIntegrations[];
    const leftJoinAndSelect = {
      com: 'ii.company',
      module: 'ii.module',
    };

    try {
      settingIntegrations = await this.find({
        where: { company },
        join: {
          alias: 'ii',
          leftJoinAndSelect,
        },
      });
    } catch (error) {
      console.error(error);
      logDatabaseError(reponame, error);
    }
    return settingIntegrations;
  }

  /**
   * Metodo utilizado para crear o actulizar las configuraciones de integraciones de ventas
   * @param data --Los cmapos requeridos para crear o actulizar las configuraciones de integraciones.
   * @returns
   */
  async createInvoicesIntegrations(data: any): Promise<InvoicesIntegrations> {
    // crea sucursal
    let response: InvoicesIntegrations;
    try {
      response = await this.save(data);
    } catch (error) {
      logDatabaseError(reponame, error);
    }
    return await response;
  }
}
