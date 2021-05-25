import { Transform, Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { validationMessage } from '../../../_tools';
import { InvoiceDocumentLayoutPositionFullDTO } from './invoice-document-layout-position-full.dto';
import { InvoiceDocumentLayoutHeaderDTO } from './invoice-document-layout-header.dto';
import { InvoiceDocumentDetailLayoutDTO } from './invoice-document-layout-details.dto';

export class InvoiceDocumentLayoutDTO {
  @IsNotEmpty({ message: validationMessage('configuration', 'IsNotEmpty') })
  configuration: string;

  @IsNotEmpty({ message: validationMessage('resolution', 'IsNotEmpty') })
  @IsNumber({}, { each: true })
  @Transform(({ value }) => parseInt(value))
  resolution: number[];

  @IsNotEmpty({ message: validationMessage('header', 'IsNotEmpty') })
  @IsArray()
  @ValidateNested()
  @Type(() => InvoiceDocumentLayoutHeaderDTO)
  header: InvoiceDocumentLayoutHeaderDTO[];

  @IsNotEmpty({ message: validationMessage('details', 'IsNotEmpty') })
  @ValidateNested()
  @Type(() => InvoiceDocumentDetailLayoutDTO)
  details: InvoiceDocumentDetailLayoutDTO;

  @IsNotEmpty({ message: validationMessage('resolution', 'IsNotEmpty') })
  @IsArray()
  @ValidateNested()
  @Type(() => InvoiceDocumentLayoutPositionFullDTO)
  totals: InvoiceDocumentLayoutPositionFullDTO[];
}
