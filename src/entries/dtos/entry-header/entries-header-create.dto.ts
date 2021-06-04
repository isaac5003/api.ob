import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { validationMessage } from '../../../_tools';
import { EntryHeaderDataDTO } from './entries-entry-header-create.dto';

export class EntryHeaderCreateDTO extends EntryHeaderDataDTO {
  @IsNotEmpty({ message: validationMessage('serie', 'IsNotEmpty') })
  @Transform(({ value }) => parseInt(value))
  @IsNumber({}, { message: validationMessage('serie', 'IsNumber') })
  serie: number;
}
