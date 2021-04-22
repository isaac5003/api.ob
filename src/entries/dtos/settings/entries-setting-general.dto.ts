import { IsISO8601, IsNotEmpty } from 'class-validator';
import { validationMessage } from 'src/_tools';

export class SettingGeneralDTO {
  @IsNotEmpty({ message: validationMessage('periodStart', 'IsNotEmpty') })
  @IsISO8601({}, { message: validationMessage('periodStart', 'IsISO8601') })
  periodStart: string;
  @IsNotEmpty({ message: validationMessage('peridoEnd', 'IsNotEmpty') })
  @IsISO8601({}, { message: validationMessage('peridoEnd', 'IsISO8601') })
  peridoEnd: string;
}
