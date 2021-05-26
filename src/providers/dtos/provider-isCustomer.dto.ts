import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty } from 'class-validator';
import { validationMessage } from 'src/_tools';

export class IsCustomerDTO {
  @IsNotEmpty({ message: validationMessage('isCustomer', 'IsNotEmpty') })
  @Transform(({ value }) => (value.toLowerCase() === 'true' ? true : value.toLowerCase() == 'false' ? false : 1))
  @IsBoolean({ message: validationMessage('isCustomer', 'IsBoolean') })
  isCustomer: boolean;
}
