import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { validationMessage } from '../../_tools';

export class InvoiceHeaderDTO {
  @IsNotEmpty({ message: validationMessage('customer', 'IsNotEmpty') })
  customer: string;

  @IsNotEmpty({ message: validationMessage('customerBranch', 'IsNotEmpty') })
  customerBranch: string;

  @IsNotEmpty({ message: validationMessage('invoicesSeller', 'IsNotEmpty') })
  invoicesSeller: string;

  @IsNotEmpty({
    message: validationMessage('InvoicesPaymentsCondition', 'IsNotEmpty'),
  })
  invoicesPaymentsCondition: string;

  @IsNotEmpty({ message: validationMessage('invoiceDate', 'IsNotEmpty') })
  @IsString({ message: validationMessage('invoiceDate', 'IsString') })
  invoiceDate: string;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 2 }, { message: validationMessage('sum', 'IsNumber') })
  @IsNotEmpty({ message: validationMessage('sum', 'IsNotEmpty') })
  sum: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 2 }, { message: validationMessage('iva', 'IsNumber') })
  @IsNotEmpty({ message: validationMessage('iva', 'IsNotEmpty') })
  iva: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 2 }, { message: validationMessage('subtotal', 'IsNumber') })
  @IsNotEmpty({ message: validationMessage('subtotal', 'IsNotEmpty') })
  subtotal: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 2 }, { message: validationMessage('ivaRetenido', 'IsNumber') })
  @IsNotEmpty({ message: validationMessage('ivaRetenido', 'IsNotEmpty') })
  ivaRetenido: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 2 }, { message: validationMessage('ventasExentas', 'IsNumber') })
  @IsNotEmpty({ message: validationMessage('ventasExentas', 'IsNotEmpty') })
  ventasExentas: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 2 }, { message: validationMessage('ventasNoSujetas', 'IsNumber') })
  @IsNotEmpty({ message: validationMessage('ventasNoSujetas', 'IsNotEmpty') })
  ventasNoSujetas: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber({ maxDecimalPlaces: 2 }, { message: validationMessage('ventaTotal', 'IsNumber') })
  @IsNotEmpty({ message: validationMessage('ventaTotal', 'IsNotEmpty') })
  ventaTotal: number;
}
