import { IsBoolean, IsNotEmpty } from 'class-validator';
import { validationMessage } from '../../../_tools';
import { ServicesIdsDTO } from './service-deleteupdate.dto';

export class UpdateStatusDTO extends ServicesIdsDTO {
  @IsNotEmpty({ message: validationMessage('active', 'IsNotEmpty') })
  @IsBoolean({ message: validationMessage('active', 'IsBoolean') })
  active: boolean;
}
