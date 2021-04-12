import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { validationMessage } from 'src/_tools';

export class InvoiceAuxiliarUpdateDTO {
  @IsOptional()
  name: string;

  @IsOptional()
  @Transform(({ value }) =>
    value.toLowerCase() === 'true'
      ? true
      : value.toLowerCase() == 'false'
      ? false
      : 2,
  )
  @IsBoolean({ message: validationMessage('active', 'IsBoolean') })
  active: boolean;

  @IsOptional()
  invoicesZone: string;

  @IsOptional()
  @Transform(({ value }) =>
    value.toLowerCase() === 'true'
      ? true
      : value.toLowerCase() == 'false'
      ? false
      : 2,
  )
  @IsBoolean({ message: validationMessage('cashPayment', 'IsBoolean') })
  cashPayment: boolean;
}
