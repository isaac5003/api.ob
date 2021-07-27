import { Invoices } from '../../invoices/entities/Invoices.entity';
import { Purchase } from '../../purchases/entities/Purchase.entity';

export class RInvoice extends Invoices {
  registerType: string;
}

export class RPurchase extends Purchase {
  registerType: string;
}
