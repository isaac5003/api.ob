import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsNotEmpty } from 'class-validator';
import { validationMessage } from 'src/_tools';

export class EchargesActiveDTO {
  @IsNotEmpty({ message: validationMessage('active', 'IsNotEmpty') })
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: validationMessage('status', 'IsInt') })
  status: number;
}
