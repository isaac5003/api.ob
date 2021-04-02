import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

export function logDatabaseError(type: string, error: any): void {
  let message: string;
  switch (error.name) {
    case 'QueryFailedError':
      switch (error.code) {
        case '23503':
          message = `El ${type} no se puede eliminar ya que está siendo utilizado en el sistema.`;
          break;
        case '22P02':
          message = `El formato de id para el ${type} seleccionado es incorrecto.`;
          break;
        default:
          message = 'Error no identificada en la base de datos.';
          break;
      }
      throw new BadRequestException(message);
    case 'EntityNotFound':
      throw new BadRequestException(`El ${type} seleccionado no existe.`);
    default:
      throw new InternalServerErrorException('Error no identificado');
  }
}

export function validationMessage(fieldname: string, type: string): string {
  switch (type) {
    case 'IsBoolean':
      return `El campo '${fieldname}' debe ser del valor "true" o "false"`;
    case 'IsInt':
      return `El campo '${fieldname}' debe ser un numero entero.`;
    case 'IsNotEmpty':
      return `El campo '${fieldname}' es requerido.`;
    case 'IsString':
      return `El campo '${fieldname}' debe ser del tipo texto.`;
  }
}
