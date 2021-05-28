import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';
import { validationMessage } from '../../_tools';

export class InvoiceReserveDataDTO {
  @IsNotEmpty({ message: validationMessage('documentType', 'IsNotEmpty') })
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: validationMessage('documentType', 'IsInt') })
  documentType: number;

  @IsNotEmpty({ message: validationMessage('sequenceForm', 'IsNotEmpty') })
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: validationMessage('sequenceForm', 'IsInt') })
  sequenceFrom: number;

  @IsNotEmpty({ message: validationMessage('authorization', 'IsNotEmpty') })
  authorization: string;

  @IsNotEmpty({ message: validationMessage('sequenceTo', 'IsNotEmpty') })
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: validationMessage('sequenceTo', 'IsInt') })
  sequenceTo: number;
}
