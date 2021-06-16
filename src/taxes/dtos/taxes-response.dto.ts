import { Invoice } from 'src/invoices/entities/Invoice.entity';
import { Purchase } from 'src/purchases/entities/Purchase.entity';

export class RInvoice extends Invoice {
  registerType: string;
}

export class RPurchase extends Purchase {
  registerType: string;
}
