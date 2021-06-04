import { Transform } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { FilterDTO } from 'src/_dtos/filter.dto';
import { validationMessage } from 'src/_tools';

export class DocumentFilterDTO extends FilterDTO {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: validationMessage('documentType', 'IsInt') })
  documentType: number;
}
