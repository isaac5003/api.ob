import { IsEmail, IsNotEmpty } from 'class-validator';
import { validationMessage } from 'src/_tools';
import { EchargesBaseDTO } from '../echarges-base.dto';

export class EchargesHeaderDTO extends EchargesBaseDTO {
  @IsNotEmpty({ message: validationMessage('customer', 'IsNotEmpty') })
  customer: string;

  @IsNotEmpty({ message: validationMessage('authorization', 'IsNotEmpty') })
  authorization: string;

  @IsNotEmpty({ message: validationMessage('sequence', 'IsNotEmpty') })
  sequence: string;

  @IsNotEmpty({ message: validationMessage('description', 'IsNotEmpty') })
  description: string;

  @IsNotEmpty({ message: validationMessage('total', 'IsNotEmpty') })
  total: number;

  @IsNotEmpty({ message: validationMessage('email', 'IsNotEmpty') })
  @IsEmail({}, { message: validationMessage('email', 'IsEmail') })
  email: string;

  @IsNotEmpty({ message: validationMessage('notify', 'IsNotEmpty') })
  notify: boolean;
}
