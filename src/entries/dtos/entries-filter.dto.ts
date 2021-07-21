import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsISO8601, IsOptional } from 'class-validator';
import { FilterDTO } from '../../_dtos/filter.dto';
import { validationMessage } from '../../_tools';

export class EntriesFilterDTO extends FilterDTO {
  @IsOptional()
  @Transform(({ value }) => (value.toLowerCase() === 'true' ? true : value.toLowerCase() == 'false' ? false : 1))
  @IsBoolean({ message: validationMessage('isProvider', 'IsBoolean') })
  squared: boolean;

  @IsOptional()
  @Transform(({ value }) => (value.toLowerCase() === 'true' ? true : value.toLowerCase() == 'false' ? false : 1))
  @IsBoolean({ message: validationMessage('isProvider', 'IsBoolean') })
  accounted: boolean;

  @IsOptional()
  @IsISO8601({}, { message: validationMessage('startDate', 'IsISO8601') })
  startDate: string;

  @IsOptional()
  @IsISO8601({}, { message: validationMessage('endDate', 'IsISO8601') })
  endDate: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: validationMessage('accountingEntryType', 'IsInt') })
  entryType: number;
}
