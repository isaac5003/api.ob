import { IsBoolean, IsNotEmpty } from 'class-validator';
import { validationMessage } from 'src/_tools';

export class ProviderStatusDTO {
  @IsNotEmpty({ message: validationMessage('isActiveProvider', 'IsNotEmpty') })
  @IsBoolean({ message: validationMessage('isActiveProvider', 'IsBoolean') })
  isActiveProvider: boolean;
}
