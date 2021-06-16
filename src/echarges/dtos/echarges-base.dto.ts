import { Customer } from 'src/customers/entities/Customer.entity';
import { Invoice } from 'src/invoices/entities/Invoice.entity';

export class EchargesBaseDTO {
  customerName: string;
  authorization: string;
  sequence: string;
  description: string;
  echargeType: string;
  total: number;
  origin: string;

  paidDate: string;
  notify: boolean;
  email: string;
  invoice: string | Invoice;
  customer: string | Customer;
}
