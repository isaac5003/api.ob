import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';
import { validationMessage } from '../../../_tools';
import { InvoiceDocumentLayoutPositionSmallDTO } from './invoice-document-layout-position-small.dto';

export class InvoiceDocumentLayoutPositionSmallExtended extends InvoiceDocumentLayoutPositionSmallDTO {
  @IsNotEmpty({ message: validationMessage('length', 'IsNotEmpty') })
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: validationMessage('length', 'IsInt') })
  length: number;
}
