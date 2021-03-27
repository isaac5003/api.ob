import { IsEmail } from 'class-validator';

export class AuthDTO {
  @IsEmail(
    {},
    {
      message: 'Se debe ingresar un correo válido.',
    },
  )
  email: string;

  password: string;
}
