import { IsNotEmpty, IsUUID } from 'class-validator';
import { validationMessage } from 'src/_tools';

export class TokenDTO {
  @IsNotEmpty({ message: validationMessage('token', 'IsNotEmpty') })
  @IsUUID('all', { message: validationMessage('token', 'IsUUID') })
  token: string;
}
