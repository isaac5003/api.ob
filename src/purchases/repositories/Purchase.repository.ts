import { Branch } from 'src/companies/entities/Branch.entity';
import { Company } from 'src/companies/entities/Company.entity';
import { Customer } from 'src/customers/entities/Customer.entity';
import { CustomerBranch } from 'src/customers/entities/CustomerBranch.entity';

import { logDatabaseError, numeroALetras } from 'src/_tools';
import { EntityRepository, Repository } from 'typeorm';
import { PurchaseBaseDTO } from '../dto/purchase-base.dto';
import { PurchaseHeaderDTO } from '../dto/validate/purchase-header.vdto';
import { Purchase } from '../entities/Purchase.entity';
import { PurchasesDocumentType } from '../entities/PurchasesDocumentType.entity';
import { PurchasesStatus } from '../entities/PurchasesStatus.entity';

const reponame = 'compras';
@EntityRepository(Purchase)
export class PurchaseRepository extends Repository<Purchase> {
  async createPurchase(
    data: Partial<PurchaseBaseDTO>,
    provider: Customer,
    providerBranch: CustomerBranch,
    company: Company,
    documentType: PurchasesDocumentType,
    branch: Branch,
    status: PurchasesStatus,
    origin: string,
  ): Promise<Purchase> {
    let response: Purchase;
    const header = {
      authorization: data.authorization,
      sequence: `${data.sequence}`,
      providerName: provider.name,
      providerAddress1: providerBranch.address1,
      providerAddress2: providerBranch.address2,
      providerCountry: providerBranch.country.name,
      providerState: providerBranch.state.name,
      providerCity: providerBranch.city.name,
      providerDui: provider.dui,
      providerNit: provider.nit,
      providerNrc: provider.nrc,
      providerGiro: provider.giro,
      branch: branch,
      sum: data.sum,
      iva: data.iva,
      subtotal: data.subtotal,
      compraNoSujeta: data.comprasNoSujetas,
      compraExenta: data.comprasExentas,
      compraTotal: data.compraTotal,
      compraTotalText: numeroALetras(data.compraTotal),
      purchaseDate: data.purchaseDate,
      status: status,
      company: company,
      provider: provider,
      providerBranch: providerBranch,
      personType: provider.personType,
      providerTypeNatural: provider.customerTypeNatural,
      documentType: documentType,
      origin,
      fovial: data.fovial,
      contrans: data.contrans,
    };
    try {
      const purchase = this.create({ company, ...header });
      response = await this.save(purchase);
    } catch (error) {
      console.error(error);
      logDatabaseError(reponame, error);
    }
    return await response;
  }

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

  async updatePurchase(id: string, company: Company, data: any): Promise<any> {
    try {
      const purchase = this.update({ id, company }, data);
      return purchase;
    } catch (error) {
      logDatabaseError(reponame, error);
    }
  }

  async deletePurchase(id: string): Promise<boolean> {
    try {
      await this.delete(id);
    } catch (error) {
      console.error(error);
      logDatabaseError(reponame, error);
    }
    return true;
  }
}
