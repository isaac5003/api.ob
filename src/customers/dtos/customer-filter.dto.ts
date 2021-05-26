import { Transform } from 'class-transformer';
import { IsOptional, IsBoolean } from 'class-validator';
import { FilterDTO } from '../../_dtos/filter.dto';
import { validationMessage } from '../../_tools';

export class CustomerFilterDTO extends FilterDTO {
  @IsOptional()
  @Transform(({ value }) => (value.toLowerCase() === 'true' ? true : value.toLowerCase() == 'false' ? false : 1))
  @IsBoolean({ message: validationMessage('branch', 'IsBoolean') })
  branch: boolean;
}
