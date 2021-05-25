import { IsISO8601, IsNotEmpty, IsUUID } from 'class-validator';
import { validationMessage } from '../../../_tools';

export class SeriesDTO {
  @IsNotEmpty({
    message: validationMessage('accountingEntryType', 'IsNotEmpty'),
  })
  @IsUUID('4', { message: validationMessage('accountingEntryType', 'IsUUID') })
  accountingEntryType: string;

  @IsNotEmpty({ message: validationMessage('date', 'IsNotEmpty') })
  @IsISO8601({}, { message: validationMessage('date', 'IsISO8601') })
  date: string;
}
