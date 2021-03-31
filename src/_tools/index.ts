import { BadRequestException } from '@nestjs/common';

export function logDatabaseError(type: string, error: any): void {
  let message: string;
  console.log(error.message);
  switch (error.code) {
    case '23503':
      message = `El ${type} no se puede eliminar ya que está siendo utilizado en el sistema.`;
      break;
    default:
      message =
        'Error al realizar la acción, se ha notificado al administrador.';
      break;
  }
  throw new BadRequestException(message);
}
