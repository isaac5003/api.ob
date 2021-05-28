import { IsBoolean, IsNotEmpty } from 'class-validator';
import { validationMessage } from 'src/_tools';

export class IsProviderDTO {
  @IsNotEmpty({ message: validationMessage('isProvider', 'IsNotEmpty') })
  @IsBoolean({ message: validationMessage('isProvider', 'IsBoolean') })
  isProvider: boolean;
}
