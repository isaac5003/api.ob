import { IsBoolean, IsISO8601, IsNotEmpty } from 'class-validator';
import { validationMessage } from '../../../_tools';

export class EntryHeaderDataDTO {
  @IsNotEmpty({
    message: validationMessage('accountingEntryType', 'IsNotEmpty'),
  })
  accountingEntryType: string;

  @IsNotEmpty({ message: validationMessage('title', 'IsNotEmpty') })
  title: string;

  @IsNotEmpty({ message: validationMessage('date', 'IsNotEmpty') })
  @IsISO8601({}, { message: validationMessage('date', 'IsISO8601') })
  date: string;

  @IsNotEmpty({ message: validationMessage('squared', 'IsNotEmpty') })
  @IsBoolean({ message: validationMessage('squared', 'IsBoolean') })
  squared: boolean;

  @IsNotEmpty({ message: validationMessage('accounted', 'IsNotEmpty') })
  @IsBoolean({ message: validationMessage('accounted', 'IsBoolean') })
  accounted: boolean;
}
