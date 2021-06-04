import { IsNotEmpty } from 'class-validator';
import { validationMessage } from 'src/_tools';

export class RefreshfTokenDTO {
  @IsNotEmpty({ message: validationMessage('refresh_token', 'IsNotEmpty') })
  refresh_token: string;
}
