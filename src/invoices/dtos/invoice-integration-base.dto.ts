import { AccountingCatalog } from '../../entries/entities/AccountingCatalog.entity';

export class InvoiceIntegrationBaseDTO {
  cashPaymentAccountingCatalog: AccountingCatalog | string;
  automaticIntegration: boolean;
  activeIntegration: boolean;
  registerService: boolean;
  recurrencyFrecuency: number | string;
  recurrencyOption: string;
}
