import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { validationMessage } from 'src/_tools';
import { InvoiceDocumentLayoutPositionSmallExtended } from './invocie-document-layout-position-small-extended.dto';
import { InvoiceDocumentLayoutPositionSmallDTO } from './invoice-document-layout-position-small.dto';

export class InvoiceDocumentDetailLayoutDTO {
  @IsNotEmpty({ message: validationMessage('position_y', 'IsNotEmpty') })
  position_y: string;

  @IsNotEmpty({ message: validationMessage('fontSize', 'IsNotEmpty') })
  fontSize: string;

  @IsNotEmpty({ message: validationMessage('heigth', 'IsNotEmpty') })
  heigth: string;

  @IsNotEmpty({ message: validationMessage('quantity', 'IsNotEmpty') })
  @ValidateNested()
  @Type(() => InvoiceDocumentLayoutPositionSmallDTO)
  quantity: InvoiceDocumentLayoutPositionSmallDTO;

  @IsNotEmpty({ message: validationMessage('description', 'IsNotEmpty') })
  @ValidateNested()
  @Type(() => InvoiceDocumentLayoutPositionSmallExtended)
  description: InvoiceDocumentLayoutPositionSmallExtended;

  @IsNotEmpty({ message: validationMessage('price', 'IsNotEmpty') })
  @ValidateNested()
  @Type(() => InvoiceDocumentLayoutPositionSmallDTO)
  price: InvoiceDocumentLayoutPositionSmallDTO;

  @IsNotEmpty({ message: validationMessage('sujeto', 'IsNotEmpty') })
  @ValidateNested()
  @Type(() => InvoiceDocumentLayoutPositionSmallDTO)
  sujeto: InvoiceDocumentLayoutPositionSmallDTO;

  @IsNotEmpty({ message: validationMessage('exento', 'IsNotEmpty') })
  @ValidateNested()
  @Type(() => InvoiceDocumentLayoutPositionSmallDTO)
  exento: InvoiceDocumentLayoutPositionSmallDTO;

  @IsNotEmpty({ message: validationMessage('afecto', 'IsNotEmpty') })
  @ValidateNested()
  @Type(() => InvoiceDocumentLayoutPositionSmallDTO)
  afecto: InvoiceDocumentLayoutPositionSmallDTO;
}
