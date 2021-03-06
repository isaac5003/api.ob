import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsNotEmpty } from 'class-validator';
import { validationMessage } from '../../../_tools';

export class InvoiceDocumentLayoutPositionFullDTO {
  @IsNotEmpty({ message: validationMessage('x', 'IsNotEmpty') })
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: validationMessage('x', 'IsInt') })
  x: number;

  @IsNotEmpty({ message: validationMessage('y', 'IsNotEmpty') })
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: validationMessage('y', 'IsInt') })
  y: number;

  @IsNotEmpty({ message: validationMessage('value', 'IsNotEmpty') })
  value: string;
}
