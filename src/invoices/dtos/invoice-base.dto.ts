import { Customer } from 'src/customers/entities/Customer.entity';
import { CustomerBranch } from 'src/customers/entities/CustomerBranch.entity';
import { CustomerType } from 'src/customers/entities/CustomerType.entity';
import { CustomerTypeNatural } from 'src/customers/entities/CustomerTypeNatural.entity';
import { PurchasesDocumentType } from 'src/purchases/entities/PurchasesDocumentType.entity';
import { PurchasesStatus } from 'src/purchases/entities/PurchasesStatus.entity';
import { InvoicesPaymentsCondition } from '../entities/InvoicesPaymentsCondition.entity';
import { InvoicesSeller } from '../entities/InvoicesSeller.entity';
import { InvoicesStatus } from '../entities/InvoicesStatus.entity';
import { InvoicesZone } from '../entities/InvoicesZone.entity';

export class InvoiceBaseDTO {
  authorization: string;
  sequence: string;
  sum: number;
  iva: number;
  subtotal: number;
  ivaRetenido: number;
  ventasExentas: number;
  ventasNoSujetas: number;
  ventaTotal: number;
  ventaTotalText: string;
  invoiceDate: string;
  customer: Customer | string;
  customerBranch: CustomerBranch | string;
  invoicesPaymentsCondition: InvoicesPaymentsCondition | string;
  invoicesSeller: InvoicesSeller | string;
  invoicesZone: InvoicesZone;
  status: InvoicesStatus | PurchasesStatus | number;
  customerType: CustomerType | number;
  customerTypeNatural: CustomerTypeNatural | number;
  documentType: DocumentType | PurchasesDocumentType | number;
}
