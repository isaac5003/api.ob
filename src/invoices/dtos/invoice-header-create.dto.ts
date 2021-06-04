import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';
import { validationMessage } from '../../_tools';
import { InvoiceHeaderDTO } from './invoice-header.dto';

export class InvoiceHeaderCreateDTO extends InvoiceHeaderDTO {
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
}
