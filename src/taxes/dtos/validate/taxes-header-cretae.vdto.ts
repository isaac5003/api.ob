import { IsNotEmpty } from 'class-validator';
import { validationMessage } from 'src/_tools';
import { TaxesHeaderDTO } from './taxes-header.vdto';

export class TaxesHeaderCreateDTO extends TaxesHeaderDTO {
  @IsNotEmpty({ message: validationMessage('registerType', 'IsNotEmpty') })
  registerType: string;
}
