import { InvoiceBaseDTO } from '../../invoices/dtos/invoice-base.dto';
import { PurchaseBaseDTO } from '../../purchases/dto/purchase-base.dto';
import { applyMixins } from '../../_tools';

export class TaxesBaseDTO {
  registerType: string;
}
export interface TaxesBaseDTO extends InvoiceBaseDTO, PurchaseBaseDTO {}
applyMixins(TaxesBaseDTO, [InvoiceBaseDTO, PurchaseBaseDTO]);
