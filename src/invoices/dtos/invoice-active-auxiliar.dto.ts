import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty } from 'class-validator';
import { validationMessage } from 'src/_tools';

export class ActiveValidateDTO {
  @IsNotEmpty({ message: validationMessage('active', 'IsNotEmpty') })
  @Transform(({ value }) => (value.toLowerCase() === 'true' ? true : value.toLowerCase() == 'false' ? false : null))
  @IsBoolean({ message: validationMessage('active', 'IsBoolean') })
  active: boolean;
}
