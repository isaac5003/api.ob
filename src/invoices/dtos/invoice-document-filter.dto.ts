import { Transform } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { FilterDTO } from 'src/_dtos/filter.dto';
import { validationMessage } from 'src/_tools';

export class InvoiceDocumentFilterDTO extends FilterDTO {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: validationMessage('type', 'IsInt') })
  type: number;
}
