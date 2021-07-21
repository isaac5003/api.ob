import { IsBoolean, IsNotEmpty } from 'class-validator';
import { validationMessage } from '../../../_tools';

export class InvoiceIntegrationActiveDTO {
  @IsNotEmpty({ message: validationMessage('activeIntegration', 'IsNotEmpty') })
  @IsBoolean({ message: validationMessage('activeIntegration', 'IsBoolean') })
  activeIntegration: boolean;
}
