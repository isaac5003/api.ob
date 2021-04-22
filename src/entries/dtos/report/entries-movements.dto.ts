import { IsISO8601, IsNotEmpty } from 'class-validator';
import { validationMessage } from 'src/_tools';
import { EndDateDTO } from './entries-enddate.dto';

export class AccountsMovementsDTO extends EndDateDTO {
  @IsNotEmpty({ message: validationMessage('startDate', 'IsNotEmpty') })
  @IsISO8601({}, { message: validationMessage('startDate', 'IsISO8601') })
  startDate: string;

  @IsNotEmpty({ message: validationMessage('selectedAccounts', 'IsNotEmpty') })
  selectedAccounts: string[];
}
