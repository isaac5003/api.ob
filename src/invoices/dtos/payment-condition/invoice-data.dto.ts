import { IsBoolean, IsNotEmpty } from 'class-validator';
import { validationMessage } from '../../../_tools';

export class InvoicePaymentConditionDataDTO {
  @IsNotEmpty({ message: validationMessage('name', 'IsNotEmpty') })
  name: string;

  @IsNotEmpty({ message: validationMessage('cashPayment', 'IsNotEmpty') })
  @IsBoolean({ message: validationMessage('cashPayment', 'IsBoolean') })
  cashPayment: boolean;
}
