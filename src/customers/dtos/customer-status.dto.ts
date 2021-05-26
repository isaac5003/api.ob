import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty } from 'class-validator';
import { validationMessage } from '../../_tools';

export class CustomerStatusDTO {
  @IsNotEmpty({ message: validationMessage('isActiveCustomer', 'IsNotEmpty') })
  @Transform(({ value }) => (value.toLowerCase() === 'true' ? true : value.toLowerCase() == 'false' ? false : null))
  @IsBoolean({ message: validationMessage('isActiveCustomer', 'IsBoolean') })
  isActiveCustomer: boolean;
}
