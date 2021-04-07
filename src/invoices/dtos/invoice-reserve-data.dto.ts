import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsUUID } from 'class-validator';
import { validationMessage } from 'src/_tools';

export class InvoiceReserveDataDTO {
  @IsNotEmpty({ message: validationMessage('documentType', 'IsNotEmpty') })
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: validationMessage('documentType', 'IsInt') })
  documentType: number;

  @IsNotEmpty({ message: validationMessage('sequenceForm', 'IsNotEmpty') })
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: validationMessage('documentType', 'IsInt') })
  sequenceForm: number;

  @IsNotEmpty({ message: validationMessage('sequenceTo', 'IsNotEmpty') })
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: validationMessage('documentType', 'IsInt') })
  sequenceTo: number;
}
