import { Customer } from 'src/customers/entities/Customer.entity';
import { Invoices } from 'src/invoices/entities/Invoices.entity';

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
  invoice: string | Invoices;
  customer: string | Customer;
}
