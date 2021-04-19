import { Transform } from 'class-transformer';
import { IsOptional, IsBoolean } from 'class-validator';
import { FilterDTO } from 'src/_dtos/filter.dto';
import { validationMessage } from 'src/_tools';

export class CustomerFilterDTO extends FilterDTO {
  @IsOptional()
  @Transform(({ value }) => (value.toLowerCase() === 'true' ? true : value.toLowerCase() == 'false' ? false : null))
  @IsBoolean({ message: validationMessage('active', 'IsBoolean') })
  active: boolean;
}
