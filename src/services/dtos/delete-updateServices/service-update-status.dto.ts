import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty } from 'class-validator';
import { validationMessage } from '../../../_tools';
import { ServicesIdsDTO } from './service-deleteupdate.dto';

export class UpdateStatusDTO extends ServicesIdsDTO {
  @IsNotEmpty({ message: validationMessage('status', 'IsNotEmpty') })
  @Transform(({ value }) => (value.toLowerCase() === 'true' ? true : value.toLowerCase() == 'false' ? false : 1))
  @IsBoolean({ message: validationMessage('status', 'IsBoolean') })
  status: boolean;
}
