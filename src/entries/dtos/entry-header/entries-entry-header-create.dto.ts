import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsISO8601, IsNotEmpty, IsNumber } from 'class-validator';
import { validationMessage } from '../../../_tools';

export class EntryHeaderDataDTO {
  @IsNotEmpty({
    message: validationMessage('accountingEntryType', 'IsNotEmpty'),
  })
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: validationMessage('accountingEntryType', 'IsInt') })
  accountingEntryType: number;

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
