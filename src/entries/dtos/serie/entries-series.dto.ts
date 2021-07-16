import { Transform } from 'class-transformer';
import { IsInt, IsISO8601, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';
import { validationMessage } from '../../../_tools';

export class SeriesDTO {
  @IsNotEmpty({
    message: validationMessage('accountingEntryType', 'IsNotEmpty'),
  })
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: validationMessage('accountingEntryType', 'IsInt') })
  accountingEntryType: number;

  @IsNotEmpty({ message: validationMessage('date', 'IsNotEmpty') })
  @IsISO8601({}, { message: validationMessage('date', 'IsISO8601') })
  date: string;
}
