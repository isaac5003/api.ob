import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { validationMessage } from 'src/_tools';
import { EntryDetailsDTO } from './entry-details/entries-details-create.dto';
import { EntryHeaderDataDTO } from './entry-header/entries-entry-header-create.dto';
import { EntryHeaderCreateDTO } from './entry-header/entries-header-create.dto';

export class EntryDataDTO {
  @IsNotEmpty({ message: validationMessage('header', 'IsNotEmpty') })
  @ValidateNested()
  @Type(() => EntryHeaderDataDTO)
  header: EntryHeaderDataDTO | EntryHeaderCreateDTO;

  @IsNotEmpty({ message: validationMessage('details', 'IsNotEmpty') })
  @ValidateNested()
  @Type(() => EntryDetailsDTO)
  details: EntryDetailsDTO[];
}
