import { IsEmail, IsNotEmpty } from 'class-validator';
import { validationMessage } from '../../_tools';

export class UserRecoveryDTO {
  @IsNotEmpty({ message: validationMessage('email', 'IsNotEmpty') })
  @IsEmail(
    {},
    {
      message: 'Se debe ingresar un correo válido.',
    },
  )
  email: string;
}
