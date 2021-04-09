import { IsNotEmpty } from 'class-validator';
import { validationMessage } from 'src/_tools';
import { InvoicesZone } from '../entities/InvoicesZone.entity';
import { InvoiceAuxiliarDataDTO } from './invoice-auxiliar-data.dto';

export class SellerCreateDTO extends InvoiceAuxiliarDataDTO {
  @IsNotEmpty({ message: validationMessage('invoicesZone', 'IsNotEmpty') })
  invoicesZone: InvoicesZone;
}
