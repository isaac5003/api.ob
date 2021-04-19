import { IsNotEmpty } from 'class-validator';
import { validationMessage } from 'src/_tools';
import { InvoicesZone } from '../entities/InvoicesZone.entity';

export class SellerCreateDTO {
  @IsNotEmpty({ message: validationMessage('name', 'IsNotEmpty') })
  name: string;

  @IsNotEmpty({ message: validationMessage('invoicesZone', 'IsNotEmpty') })
  invoicesZone: InvoicesZone;
}
