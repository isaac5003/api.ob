import { IsBoolean, IsNotEmpty } from 'class-validator';
import { validationMessage } from '../../_tools';

export class serviceStatusDTO {
  @IsNotEmpty({ message: validationMessage('active', 'IsNotEmpty') })
  @IsBoolean({ message: validationMessage('active', 'IsBoolean') })
  active: boolean;
}
