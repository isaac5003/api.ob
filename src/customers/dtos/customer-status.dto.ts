import { Transform } from 'class-transformer';
import { IsBooleanString, IsNotEmpty } from 'class-validator';
import { validationMessage } from 'src/_tools';

export class CustomerStatusDTO {
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  @IsBooleanString({
    message: validationMessage('isActiveCustomer', 'IsBooleanString'),
  })
  isActiveCustomer: boolean;
}
