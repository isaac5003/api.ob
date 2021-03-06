import { IsNotEmpty } from 'class-validator';
import { SellingType } from '../../system/entities/SellingType.entity';
import { validationMessage } from '../../_tools';
import { Invoices } from '../entities/invoices.entity';
import { InvoiceDetailDTO } from './invoice-details.dto';

export class InvoiceDetailDataDTO extends InvoiceDetailDTO {
  @IsNotEmpty({ message: validationMessage('invoice', 'IsNotEmpty') })
  invoice: Invoices;
  @IsNotEmpty({ message: validationMessage('sellingType', 'IsNotEmpty') })
  sellingType: SellingType;
}
