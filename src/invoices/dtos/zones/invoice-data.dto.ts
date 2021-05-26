import { IsNotEmpty } from 'class-validator';
import { validationMessage } from '../../../_tools';

export class InvoiceZonesDataDTO {
  @IsNotEmpty({ message: validationMessage('name', 'IsNotEmpty') })
  name: string;
}
