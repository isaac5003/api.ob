import { IsNotEmpty } from 'class-validator';
import { validationMessage } from 'src/_tools';
import { InvoiceHeaderDTO } from './invoice-header.dto';

export class InvoiceDataDTO {
  @IsNotEmpty({ message: validationMessage('header', 'IsNotEmpty') })
  header: InvoiceHeaderDTO;
}
