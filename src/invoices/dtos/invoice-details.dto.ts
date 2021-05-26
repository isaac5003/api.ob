import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsNumber, IsBoolean } from 'class-validator';
import { validationMessage } from '../../_tools';

export class InvoiceDetailDTO {
  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 2 }, { message: validationMessage('quantity', 'IsNumber') })
  @IsNotEmpty({ message: validationMessage('quantity', 'IsNotEmpty') })
  quantity: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 2 }, { message: validationMessage('unitPrice', 'IsNumber') })
  @IsNotEmpty({ message: validationMessage('unitPrice', 'IsNotEmpty') })
  unitPrice: number;

  @IsNotEmpty({ message: validationMessage('chargeDescription', 'IsNotEmpty') })
  @IsString({ message: validationMessage('chargeDescription', 'IsString') })
  chargeDescription: string;

  @IsNotEmpty({ message: validationMessage('incTax', 'IsNotEmpty') })
  @Transform(({ value }) => (value.toLowerCase() === 'true' ? true : value.toLowerCase() == 'false' ? false : null))
  @IsBoolean({ message: validationMessage('incTax', 'IsBoolean') })
  incTax: boolean;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 2 }, { message: validationMessage('ventaPrice', 'IsNumber') })
  @IsNotEmpty({ message: validationMessage('ventaPrice', 'IsNotEmpty') })
  ventaPrice: number;

  @IsNotEmpty({ message: validationMessage('service', 'IsNotEmpty') })
  @IsString({ message: validationMessage('service', 'IsString') })
  selectedService: string;
}
