import { IsNotEmpty, IsUUID } from 'class-validator';
import { validationMessage } from 'src/_tools';

export class CustomerIdDTO {
  @IsNotEmpty({ message: validationMessage('customerId', 'IsNotEmpty') })
  @IsUUID('4', { message: validationMessage('customerId', 'IsUUID') })
  customerId: string;
}
