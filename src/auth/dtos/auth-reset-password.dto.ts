import { IsNotEmpty } from 'class-validator';
import { validationMessage } from 'src/_tools';
import { TokenDTO } from './auth-token.dto';

export class ResetPasswordDTO extends TokenDTO {
  @IsNotEmpty({ message: validationMessage('newPassword', 'IsNotEmpty') })
  newPassword: string;
}
