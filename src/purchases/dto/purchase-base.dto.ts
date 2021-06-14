import { Customer } from 'src/customers/entities/Customer.entity';
import { CustomerBranch } from 'src/customers/entities/CustomerBranch.entity';
import { CustomerType } from 'src/customers/entities/CustomerType.entity';
import { CustomerTypeNatural } from 'src/customers/entities/CustomerTypeNatural.entity';
import { InvoicesStatus } from 'src/invoices/entities/InvoicesStatus.entity';
import { PurchasesDocumentType } from '../entities/PurchasesDocumentType.entity';
import { PurchasesPaymentsCondition } from '../entities/PurchasesPaymentsCondition.entity';
import { PurchasesStatus } from '../entities/PurchasesStatus.entity';

export class PurchaseBaseDTO {
  authorization: string;
  sequence: string;
  sum: number;
  iva: number;
  subtotal: number;
  comprasExentas: number;
  comprasNoSujetas: number;
  compraTotal: number;
  compraTotalText: string;
  purchaseDate: string;
  provider: Customer | string;
  providerBranch: CustomerBranch | string;
  purchasePaymentsCondition: PurchasesPaymentsCondition | string;
  status: PurchasesStatus | InvoicesStatus | number;
  providerType: CustomerType | number;
  providerTypeNatural: CustomerTypeNatural | number;
  documentType: PurchasesDocumentType | DocumentType | number;
}
