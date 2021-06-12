import { Transform } from 'class-transformer';
import { IsInt, IsISO8601, IsNotEmpty, IsNumber } from 'class-validator';
import { InvoiceBaseDTO } from 'src/invoices/dtos/invoice-base.dto';
import { PurchaseBaseDTO } from 'src/purchases/dto/purchase-base.dto';
import { validationMessage } from 'src/_tools';

export class TaxesInvoiceHeaderDTO extends InvoiceBaseDTO {
  @IsNotEmpty({ message: validationMessage('registerType', 'IsNotEmpty') })
  registerType: string;

  @IsNotEmpty({ message: validationMessage('documentType', 'IsNotEmpty') })
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: validationMessage('documentType', 'IsInt') })
  documentType: number;

  @IsNotEmpty({ message: validationMessage('authorization', 'IsNotEmpty') })
  authorization: string;

  @IsNotEmpty({ message: validationMessage('sequence', 'IsNotEmpty') })
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: validationMessage('sequence', 'IsInt') })
  sequence: number;

  @IsNotEmpty({ message: validationMessage('customer', 'IsNotEmpty') })
  customer: string;

  @IsNotEmpty({ message: validationMessage('invoiceDate', 'IsNotEmpty') })
  @IsISO8601({}, { message: validationMessage('invoiceDate', 'IsISO8601') })
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
  @IsNumber({ maxDecimalPlaces: 2 }, { message: validationMessage('ventaTotal', 'IsNumber') })
  @IsNotEmpty({ message: validationMessage('ventaTotal', 'IsNotEmpty') })
  ventaTotal: number;
}
export class TaxesPurchaseHeaderDTO extends PurchaseBaseDTO {
  @IsNotEmpty({ message: validationMessage('registerType', 'IsNotEmpty') })
  registerType: string;

  @IsNotEmpty({ message: validationMessage('documentType', 'IsNotEmpty') })
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: validationMessage('documentType', 'IsInt') })
  documentType: number;

  @IsNotEmpty({ message: validationMessage('authorization', 'IsNotEmpty') })
  authorization: string;

  @IsNotEmpty({ message: validationMessage('sequence', 'IsNotEmpty') })
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: validationMessage('sequence', 'IsInt') })
  sequence: number;

  @IsNotEmpty({ message: validationMessage('provider', 'IsNotEmpty') })
  provider: string;

  @IsNotEmpty({ message: validationMessage('providerDate', 'IsNotEmpty') })
  @IsISO8601({}, { message: validationMessage('providerDate', 'IsISO8601') })
  providereDate: string;

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
  @IsNumber({ maxDecimalPlaces: 2 }, { message: validationMessage('ventaTotal', 'IsNumber') })
  @IsNotEmpty({ message: validationMessage('ventaTotal', 'IsNotEmpty') })
  ventaTotal: number;
}
