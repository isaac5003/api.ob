import { IsNotEmpty, IsUUID } from 'class-validator';
import { validationMessage } from 'src/_tools';
import { InvoiceDocumentDataDTO } from './invoice-document-data.dto';

export class InvoiceDocumentUpdateDTO extends InvoiceDocumentDataDTO {
  @IsNotEmpty({ message: validationMessage('id', 'IsNotEmpty') })
  @IsUUID('4', { message: validationMessage('id', 'IsUUID') })
  id: string;
}
