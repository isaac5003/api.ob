import { Transform } from 'class-transformer';
import { IsInt, IsISO8601, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { TaxesBaseDTO } from '../taxes-base.dto';
import { validationMessage } from '../../../_tools';

export class TaxesHeaderDTO extends TaxesBaseDTO {
  @IsNotEmpty({ message: validationMessage('documentType', 'IsNotEmpty') })
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: validationMessage('documentType', 'IsInt') })
  documentType: number;

  @IsNotEmpty({ message: validationMessage('authorization', 'IsNotEmpty') })
  authorization: string;

  @IsNotEmpty({ message: validationMessage('sequence', 'IsNotEmpty') })
  sequence: string;

  @IsOptional()
  customer: string;

  @IsOptional()
  @IsISO8601({}, { message: validationMessage('invoiceDate', 'IsISO8601') })
  invoiceDate: string;

  @IsOptional()
  provider: string;

  @IsOptional()
  @IsISO8601({}, { message: validationMessage('purchaseDate', 'IsISO8601') })
  purchaseDate: string;

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
