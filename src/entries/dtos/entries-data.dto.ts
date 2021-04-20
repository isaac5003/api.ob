import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { validationMessage } from 'src/_tools';
import { EntryDetailsDTO } from './entries-details-create.dto';
import { EntryHeaderDataDTO } from './entries-entry-header-create.dto';
import { EntryHeaderCreateDTO } from './entries-header-create.dto';

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
