import { IsBoolean, IsNotEmpty } from 'class-validator';
import { validationMessage } from 'src/_tools';

export class IsCustomerDTO {
  @IsNotEmpty({ message: validationMessage('isCustomer', 'IsNotEmpty') })
  @IsBoolean({ message: validationMessage('isCustomer', 'IsBoolean') })
  isCustomer: boolean;
}
