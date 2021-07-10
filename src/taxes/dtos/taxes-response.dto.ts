import { Invoice } from '../../invoices/entities/Invoice.entity';
import { Purchase } from '../../purchases/entities/Purchase.entity';

export class RInvoice extends Invoice {
  registerType: string;
}

export class RPurchase extends Purchase {
  registerType: string;
}
