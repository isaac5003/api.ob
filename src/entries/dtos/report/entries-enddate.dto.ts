import { IsISO8601, IsNotEmpty } from 'class-validator';
import { validationMessage } from '../../../_tools';

export class EndDateDTO {
  @IsNotEmpty({ message: validationMessage('endDate', 'IsNotEmpty') })
  @IsISO8601({}, { message: validationMessage('endDate', 'IsISO8601') })
  endDate: string;
}
