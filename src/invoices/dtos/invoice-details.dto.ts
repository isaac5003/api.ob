import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { Service } from 'src/services/entities/Service.entity';
import { validationMessage } from 'src/_tools';

export class InvoiceDetailDTO {
  @IsNotEmpty({ message: validationMessage('chargeDescription', 'IsNotEmpty') })
  @IsString({ message: validationMessage('chargeDescription', 'IsString') })
  chargeDescription: string;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: validationMessage('quantity', 'IsNumber') },
  )
  @IsNotEmpty({ message: validationMessage('quantity', 'IsNotEmpty') })
  quantity: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: validationMessage('unitPrice', 'IsNumber') },
  )
  @IsNotEmpty({ message: validationMessage('unitPrice', 'IsNotEmpty') })
  unitPrice: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: validationMessage('ventaPrice', 'IsNumber') },
  )
  @IsNotEmpty({ message: validationMessage('ventaPrice', 'IsNotEmpty') })
  ventaPrice: number;

  @IsNotEmpty({ message: validationMessage('service', 'IsNotEmpty') })
  service: Service;
}
