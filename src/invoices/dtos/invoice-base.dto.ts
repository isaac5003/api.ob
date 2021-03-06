import { Customer } from 'src/customers/entities/Customer.entity';
import { CustomerBranch } from 'src/customers/entities/CustomerBranch.entity';
import { PersonType } from 'src/customers/entities/customers.personType.entity';
import { CustomerTypeNatural } from 'src/customers/entities/CustomerTypeNatural.entity';
import { PurchasesDocumentType } from 'src/purchases/entities/PurchasesDocumentType.entity';
import { PurchasesStatus } from 'src/purchases/entities/PurchasesStatus.entity';
import { InvoicesPaymentsConditions } from '../entities/invoices.paymentsConditions.entity';
import { InvoicesSellers } from '../entities/invoices.sellers.entity';
import { InvoicesStatuses } from '../entities/invoices.statuses.entity';
import { InvoicesZones } from '../entities/invoices.zones.entity';

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
  invoicesPaymentsCondition: InvoicesPaymentsConditions | string;
  invoicesSeller: InvoicesSellers | string;
  invoicesZone: InvoicesZones;
  status: InvoicesStatuses | PurchasesStatus | number;
  personType: PersonType | number;
  customerTypeNatural: CustomerTypeNatural | number;
  documentType: DocumentType | PurchasesDocumentType | number;
}
