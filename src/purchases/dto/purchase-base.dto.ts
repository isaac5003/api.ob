import { Customer } from 'src/customers/entities/Customer.entity';
import { CustomerBranch } from 'src/customers/entities/CustomerBranch.entity';
import { PersonType } from 'src/customers/entities/customers.personType.entity';
import { CustomerTypeNatural } from 'src/customers/entities/CustomerTypeNatural.entity';
import { InvoicesStatuses } from 'src/invoices/entities/invoices.statuses.entity';
import { PurchasesDocumentType } from '../entities/PurchasesDocumentType.entity';
import { PurchasesPaymentsCondition } from '../entities/PurchasesPaymentsCondition.entity';
import { PurchasesStatus } from '../entities/PurchasesStatus.entity';

export class PurchaseBaseDTO {
  authorization: string;
  sequence: string;
  sum: number;
  iva: number;
  fovial: number;
  contrans: number;
  subtotal: number;
  comprasExentas: number;
  comprasNoSujetas: number;
  compraTotal: number;
  compraTotalText: string;
  purchaseDate: string;
  provider: Customer | string;
  providerBranch: CustomerBranch | string;
  purchasePaymentsCondition: PurchasesPaymentsCondition | string;
  status: PurchasesStatus | InvoicesStatuses | number;
  providerType: PersonType | number;
  providerTypeNatural: CustomerTypeNatural | number;
  documentType: PurchasesDocumentType | DocumentType | number;
}
