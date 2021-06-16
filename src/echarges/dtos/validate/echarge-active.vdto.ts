import { IsBoolean, IsNotEmpty } from 'class-validator';
import { validationMessage } from 'src/_tools';

export class EchargesActiveDTO {
  @IsNotEmpty({ message: validationMessage('active', 'IsNotEmpty') })
  @IsBoolean({ message: validationMessage('active', 'IsBoolean') })
  active: boolean;
}
