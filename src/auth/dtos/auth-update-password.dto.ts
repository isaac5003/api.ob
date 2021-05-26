import { IsNotEmpty } from 'class-validator';
import { validationMessage } from 'src/_tools';

export class updatePassWordDTO {
  @IsNotEmpty({ message: validationMessage('currentPassword', 'IsNotEmpty') })
  currentPassword: string;

  @IsNotEmpty({ message: validationMessage('newPassword', 'IsNotEmpty') })
  newPassword: string;
}
