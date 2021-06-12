import { Branch } from 'src/companies/entities/Branch.entity';
import { Company } from 'src/companies/entities/Company.entity';
import { PurchaseDetail } from '../entities/PurchaseDetail.entity';
import { PurchasesStatus } from '../entities/PurchasesStatus.entity';

export class PurchaseBaseDTO {
  authorization: string;
  sequence: number;
  sum: number;
  iva: number;
  subtotal: number;
  ivaRetenido: number;
  comprasExentas: number;
  comprasNoSujetas: number;
  compraTotal: number;
  compraTotalText: string;
  purchaseDate: string;
  branch: Branch;
  company: Company;
  providerBranch: string;
  provider: string;
  purchasePaymentsCondition: string;
  status: PurchasesStatus;
  providerType: string;
  providerTypeNatural: string;
  documentType: number;
  purchaseDetails: PurchaseDetail[];
}
