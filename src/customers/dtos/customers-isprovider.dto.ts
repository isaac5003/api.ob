import { IsBoolean, IsOptional } from 'class-validator';
import { validationMessage } from 'src/_tools';

export class IsProviderDTO {
  @IsOptional()
  @IsBoolean({ message: validationMessage('isProvider', 'IsBoolean') })
  isProvider: boolean;
}
