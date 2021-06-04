import { IsBoolean, IsNotEmpty } from 'class-validator';
import { validationMessage } from '../../_tools';

export class CustomerStatusDTO {
  @IsNotEmpty({ message: validationMessage('isActiveCustomer', 'IsNotEmpty') })
  @IsBoolean({ message: validationMessage('isActiveCustomer', 'IsBoolean') })
  isActiveCustomer: boolean;
}
