import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty } from 'class-validator';
import { validationMessage } from 'src/_tools';
import { InvoiceAuxiliarDataDTO } from './invoice-auxiliar-data.dto';

export class PaymentConditionCreateDTO extends InvoiceAuxiliarDataDTO {
  @IsNotEmpty({ message: validationMessage('cashPayment', 'IsNotEmpty') })
  @Transform(({ value }) =>
    value.toLowerCase() === 'true'
      ? true
      : value.toLowerCase() == 'false'
      ? false
      : null,
  )
  @IsBoolean({ message: validationMessage('cashPayment', 'IsBoolean') })
  cashPayment: boolean;
}
