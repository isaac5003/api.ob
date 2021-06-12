import { Branch } from 'src/companies/entities/Branch.entity';
import { Company } from 'src/companies/entities/Company.entity';
import { InvoiceDetail } from '../entities/InvoiceDetail.entity';
import { InvoicesStatus } from '../entities/InvoicesStatus.entity';

export class InvoiceBaseDTO {
  authorization: string;
  sequence: number;
  sum: number;
  iva: number;
  subtotal: number;
  ivaRetenido: number;
  ventasExentas: number;
  ventasNoSujetas: number;
  ventaTotal: number;
  ventaTotalText: string;
  invoiceDate: string;
  branch: Branch;
  company: Company;
  customerBranch: string;
  customer: string;
  invoicesPaymentsCondition: string;
  invoicesSeller: string;
  invoicesZone: string;
  status: InvoicesStatus;
  customerType: string;
  customerTypeNatural: string;
  documentType: number;
  invoiceDetails: InvoiceDetail[];
}
