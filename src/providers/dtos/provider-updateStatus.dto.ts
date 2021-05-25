import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty } from 'class-validator';
import { validationMessage } from 'src/_tools';

export class ProviderStatusDTO {
  @IsNotEmpty({ message: validationMessage('isActiveProvider', 'IsNotEmpty') })
  @Transform(({ value }) => (value.toLowerCase() === 'true' ? true : value.toLowerCase() == 'false' ? false : 1))
  @IsBoolean({ message: validationMessage('isActiveProvider', 'IsBoolean') })
  isActiveProvider: boolean;
}
