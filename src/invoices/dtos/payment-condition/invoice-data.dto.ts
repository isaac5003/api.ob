import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty } from 'class-validator';
import { validationMessage } from 'src/_tools';

export class InvoicePaymentConditionDataDTO {
  @IsNotEmpty({ message: validationMessage('name', 'IsNotEmpty') })
  name: string;

  @IsNotEmpty({ message: validationMessage('cashPayment', 'IsNotEmpty') })
  @Transform(({ value }) => (value.toLowerCase() === 'true' ? true : value.toLowerCase() == 'false' ? false : null))
  @IsBoolean({ message: validationMessage('cashPayment', 'IsBoolean') })
  cashPayment: boolean;
}
