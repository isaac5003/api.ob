import { IsNotEmpty } from 'class-validator';
import { validationMessage } from 'src/_tools';

export class InvoiceAuxiliarDataDTO {
  @IsNotEmpty({ message: validationMessage('name', 'IsNotEmpty') })
  name: string;
}
