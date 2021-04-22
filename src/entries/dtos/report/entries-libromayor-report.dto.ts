import { IsISO8601, IsNotEmpty } from 'class-validator';
import { validationMessage } from 'src/_tools';

export class DiarioMayorDTO {
  @IsNotEmpty({ message: validationMessage('date', 'IsNotEmpty') })
  @IsISO8601({}, { message: validationMessage('date', 'IsISO8601') })
  date: string;
}
