import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';
import { validationMessage } from 'src/_tools';

export class PurchaseDetailDTO {
  @IsNotEmpty({ message: validationMessage('quantity', 'IsNotEmpty') })
  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 2 }, { message: validationMessage('quantity', 'IsNumber') })
  quantity: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 2 }, { message: validationMessage('unitPrice', 'IsNumber') })
  @IsNotEmpty({ message: validationMessage('unitPrice', 'IsNotEmpty') })
  unitPrice: number;

  @IsNotEmpty({ message: validationMessage('chargeDescription', 'IsNotEmpty') })
  chargeDescription: string;

  @IsNotEmpty({ message: validationMessage('incTax', 'IsNotEmpty') })
  @Transform(({ value }) => (value.toLowerCase() === 'true' ? true : value.toLowerCase() == 'false' ? false : null))
  @IsBoolean({ message: validationMessage('incTax', 'IsBoolean') })
  incTax: boolean;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 2 }, { message: validationMessage('ventaPrice', 'IsNumber') })
  @IsNotEmpty({ message: validationMessage('ventaPrice', 'IsNotEmpty') })
  ventaPrice: number;
}
