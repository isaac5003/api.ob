import { IsArray, IsNotEmpty } from 'class-validator';
import { validationMessage } from 'src/_tools';

export class EstadoBalanceDTO {
  @IsNotEmpty({ message: validationMessage('setting', 'IsNotEmpty') })
  settings: any[];
}
