import { IsBoolean, IsOptional } from 'class-validator';
import { validationMessage } from 'src/_tools';

export class IsCustomerDTO {
  @IsOptional()
  @IsBoolean({ message: validationMessage('isCustomer', 'IsBoolean') })
  isCustomer: boolean;
}
