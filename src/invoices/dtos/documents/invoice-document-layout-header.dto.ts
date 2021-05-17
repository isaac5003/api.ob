import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';
import { validationMessage } from 'src/_tools';
import { InvoiceDocumentLayoutPositionFullDTO } from './invoice-document-layout-position-full.dto';

export class InvoiceDocumentLayoutHeaderDTO extends InvoiceDocumentLayoutPositionFullDTO {
  @IsNotEmpty({ message: validationMessage('length', 'IsNotEmpty') })
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: validationMessage('length', 'IsInt') })
  length: number;
}
