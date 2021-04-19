import { IsNotEmpty } from 'class-validator';
import { validationMessage } from 'src/_tools';

export class InvoiceSellerDataDTO {
  @IsNotEmpty({ message: validationMessage('name', 'IsNotEmpty') })
  name: string;

  @IsNotEmpty({ message: validationMessage('invoicesZone', 'IsNotEmpty') })
  invoicesZone: string;
}
