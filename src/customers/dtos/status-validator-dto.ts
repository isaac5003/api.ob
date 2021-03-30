import { Transform } from 'class-transformer';
import { IsBooleanString, IsNotEmpty } from 'class-validator';

export class CustomerValidateStatusDTO {
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  @IsBooleanString({ message: 'status debe ser de tipo boolean' })
  status: boolean;
}
