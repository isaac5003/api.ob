import { IsISO8601, IsOptional } from 'class-validator';
import { validationMessage } from 'src/_tools';
import { EndDateDTO } from './entries-enddate.dto';

export class BalanceEstadoDTO extends EndDateDTO {
  @IsOptional()
  @IsISO8601({}, { message: validationMessage('startDate', 'IsISO8601') })
  startDate: string;
}
