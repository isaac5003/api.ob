import { ArrayNotEmpty, IsArray, IsNotEmpty } from 'class-validator';
import { validationMessage } from 'src/_tools';

export class ServicesIdsDTO {
  @IsNotEmpty({ message: validationMessage('ids', 'IsNotEmpty') })
  @IsArray({ message: validationMessage('ids', 'IsArray') })
  @ArrayNotEmpty({ message: validationMessage('ids', 'ArrayNotEmpty') })
  ids: string[];
}
