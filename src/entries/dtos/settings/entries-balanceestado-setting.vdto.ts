import { IsNotEmpty } from 'class-validator';
import { validationMessage } from '../../../_tools';

export class EstadoBalanceDTO {
  @IsNotEmpty({ message: validationMessage('setting', 'IsNotEmpty') })
  settings: any[];
}
