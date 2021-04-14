import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty } from 'class-validator';
import { validationMessage } from 'src/_tools';

export class DocumentDetailsOptionDTO {
  @IsNotEmpty({ message: validationMessage('x', 'IsNotEmpty') })
  @Transform(({ value }) => parseInt(value))
  @IsInt({ message: validationMessage('x', 'IsInt') })
  x: number;

  @IsNotEmpty({ message: validationMessage('value', 'IsNotEmpty') })
  value: string;

  @IsNotEmpty({ message: validationMessage('type', 'IsNotEmpty') })
  type: string;
}
