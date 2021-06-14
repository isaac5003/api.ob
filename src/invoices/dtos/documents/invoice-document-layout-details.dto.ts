import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { validationMessage } from '../../../_tools';
import { InvoiceDocumentLayoutPositionSmallExtended } from './invocie-document-layout-position-small-extended.dto';
import { InvoiceDocumentLayoutPositionSmallDTO } from './invoice-document-layout-position-small.dto';

export class InvoiceDocumentDetailLayoutDTO {
  @IsNotEmpty({ message: validationMessage('position_y', 'IsNotEmpty') })
  position_y: string;

  @IsNotEmpty({ message: validationMessage('heigth', 'IsNotEmpty') })
  heigth: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => InvoiceDocumentLayoutPositionSmallDTO)
  quantity: InvoiceDocumentLayoutPositionSmallDTO;

  @IsOptional()
  @ValidateNested()
  @Type(() => InvoiceDocumentLayoutPositionSmallExtended)
  description: InvoiceDocumentLayoutPositionSmallExtended;

  @IsOptional()
  @ValidateNested()
  @Type(() => InvoiceDocumentLayoutPositionSmallDTO)
  price: InvoiceDocumentLayoutPositionSmallDTO;

  @IsOptional()
  @ValidateNested()
  @Type(() => InvoiceDocumentLayoutPositionSmallDTO)
  sujeto: InvoiceDocumentLayoutPositionSmallDTO;

  @IsOptional()
  @ValidateNested()
  @Type(() => InvoiceDocumentLayoutPositionSmallDTO)
  exento: InvoiceDocumentLayoutPositionSmallDTO;

  @IsOptional()
  @ValidateNested()
  @Type(() => InvoiceDocumentLayoutPositionSmallDTO)
  afecto: InvoiceDocumentLayoutPositionSmallDTO;
}
