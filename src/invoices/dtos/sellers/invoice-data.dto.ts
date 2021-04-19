import { IsNotEmpty, IsString } from 'class-validator';
import { InvoicesZone } from 'src/invoices/entities/InvoicesZone.entity';
import { validationMessage } from 'src/_tools';

export class InvoiceSellerDataDTO {
  @IsNotEmpty({ message: validationMessage('name', 'IsNotEmpty') })
  @IsString({ message: validationMessage('name', 'IsString') })
  name: string;

  @IsNotEmpty({ message: validationMessage('invoicesZone', 'IsNotEmpty') })
  @IsString({ message: validationMessage('invoicesZone', 'IsString') })
  invoicesZone: InvoicesZone;
}
