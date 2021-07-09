import { IsNotEmpty } from 'class-validator';
import { validationMessage } from '../../../_tools';

export class SettingSignaturesDTO {
  @IsNotEmpty({ message: validationMessage('legal', 'IsNotEmpty') })
  legal: string;
  @IsNotEmpty({ message: validationMessage('accountant', 'IsNotEmpty') })
  accountant: string;
  @IsNotEmpty({ message: validationMessage('auditor', 'IsNotEmpty') })
  auditor: string;
}
