import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';
import { validationMessage } from '../../../_tools';

export class InvoiceDocumentDataDTO {
  @IsNotEmpty({ message: validationMessage('authorization', 'IsNotEmpty') })
  authorization: string;

  @IsNotEmpty({ message: validationMessage('initial', 'IsNotEmpty') })
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: validationMessage('initial', 'IsInt') })
  initial: number;

  @IsNotEmpty({ message: validationMessage('fianl', 'IsNotEmpty') })
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: validationMessage('final', 'IsInt') })
  final: number;

  @IsNotEmpty({ message: validationMessage('current', 'IsNotEmpty') })
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: validationMessage('current', 'IsInt') })
  current: number;

  @IsNotEmpty({ message: validationMessage('', 'IsNotEmpty') })
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: validationMessage('documentType', 'IsInt') })
  documentType: DocumentType;
}
