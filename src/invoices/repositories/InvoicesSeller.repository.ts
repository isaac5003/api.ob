import { Company } from 'src/companies/entities/Company.entity';
import { logDatabaseError } from 'src/_tools';
import { EntityRepository, Repository } from 'typeorm';
import { InvoicesSeller } from '../entities/InvoicesSeller.entity';

const reponame = 'vendedor';
@EntityRepository(InvoicesSeller)
export class InvoicesSellerRepository extends Repository<InvoicesSeller> {
  async getSeller(
    company: Company,
    id: string,
    joins: string[] = [],
  ): Promise<InvoicesSeller> {
    let invoiceSeller: InvoicesSeller;

    const leftJoinAndSelect = {
      iz: 'i.invoicesZone',
    };

    for (const table of joins) {
      switch (table) {
        case 'ac':
          leftJoinAndSelect['ac'] = 'i.accountingCatalog';
          break;
      }
    }

    try {
      invoiceSeller = await this.findOneOrFail(
        { id, company },
        {
          join: {
            alias: 'i',
            leftJoinAndSelect,
          },
        },
      );
    } catch (error) {
      logDatabaseError(reponame, error);
    }
    return invoiceSeller;
  }
}
