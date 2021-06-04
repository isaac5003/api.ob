import { Transform } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { FilterDTO } from '../../_dtos/filter.dto';
import { validationMessage } from '../../_tools';

export class InvoiceDocumentFilterDTO extends FilterDTO {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: validationMessage('type', 'IsInt') })
  type: number;
}
