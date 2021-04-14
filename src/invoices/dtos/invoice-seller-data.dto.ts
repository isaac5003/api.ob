import { IsNotEmpty } from 'class-validator';
import { validationMessage } from 'src/_tools';
import { InvoiceAuxiliarDataDTO } from './invoice-auxiliar-data.dto';

export class InvoiceSellerDataDTO extends InvoiceAuxiliarDataDTO {
  @IsNotEmpty({ message: validationMessage('invoicesZone', 'IsNotEmpty') })
  invoicesZone: string;
}
