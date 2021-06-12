import { Company } from 'src/companies/entities/Company.entity';
import { Customer } from 'src/customers/entities/Customer.entity';
import { CustomerBranch } from 'src/customers/entities/CustomerBranch.entity';
import { InvoicesDocumentType } from 'src/invoices/entities/InvoicesDocumentType.entity';
import { InvoicesStatus } from 'src/invoices/entities/InvoicesStatus.entity';

import { logDatabaseError, numeroALetras } from 'src/_tools';
import { EntityRepository, Repository } from 'typeorm';
import { Purchase } from '../entities/Purchase.entity';

const reponame = 'compras';
@EntityRepository(Purchase)
export class PurchaseRepository extends Repository<Purchase> {
  // async createTaxesPurchase(
  //   data: RegisterTaxDTO,
  //   customer: Customer,
  //   customerBranch: CustomerBranch,
  //   company: Company,
  //   documentType: InvoicesDocumentType,
  //   status: InvoicesStatus,
  //   origin: string,
  // ): Promise<Purchase> {
  //   let response: Purchase;
  //   const header = {
  //     authorization: data.authorization,
  //     sequence: `${data.sequence}`,
  //     customerName: customer.name,
  //     customerAddress1: customerBranch.address1,
  //     customerAddress2: customerBranch.address2,
  //     customerCountry: customerBranch.country.name,
  //     customerState: customerBranch.state.name,
  //     customerCity: customerBranch.city.name,
  //     customerDui: customer.dui,
  //     customerNit: customer.nit,
  //     customerNrc: customer.nrc,
  //     customerGiro: customer.giro,
  //     sum: data.sum,
  //     iva: data.iva,
  //     subtotal: data.subtotal,
  //     ivaRetenido: data.ivaRetenido,
  //     ventaTotal: data.ventaTotal,
  //     ventaTotalText: numeroALetras(data.ventaTotal),
  //     invoiceDate: data.invoiceDate,
  //     status: status,
  //     company: company,
  //     customerBranch: customerBranch,
  //     customerType: customer.customerType,
  //     customerTypeNatural: customer.customerTypeNatural,
  //     documentType: documentType,
  //     origin,
  //   };
  //   try {
  //     const invoice = this.create({ company, ...header });
  //     response = await this.save(invoice);
  //   } catch (error) {
  //     console.error(error);
  //     logDatabaseError(reponame, error);
  //   }
  //   return await response;
  // }

  async getPurchase(company: Company, id: string, joins: string[] = []): Promise<Purchase> {
    let purchase: Purchase;

    const leftJoinAndSelect = {
      pd: 'p.purchaseDetails',
      c: 'p.provider',
      cb: 'p.providerBranch',
      ct: 'p.providerType',
      ctn: 'p.providerTypeNatural',
      dt: 'p.documentType',
      ppc: 'p.purchasePaymentsCondition',
      status: 'p.status',
    };

    for (const table of joins) {
      switch (table) {
        case 'ac':
          leftJoinAndSelect['ac'] = 'p.accountingCatalog';
          break;
      }
    }

    try {
      purchase = await this.findOneOrFail(
        { id, company },
        {
          join: {
            alias: 'p',
            leftJoinAndSelect,
          },
        },
      );
    } catch (error) {
      console.error(error);

      logDatabaseError(reponame, error);
    }
    return purchase;
  }
}
