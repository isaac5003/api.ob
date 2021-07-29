import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Profile } from 'src/auth/entities/Profile.entity';

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
    case 'EntityNotFoundError':
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
    case 'IsISO8601':
      return `El campo '${fieldname}' debe ser una fecha en el formato "yyyy-MM-dd".`;
    case 'IsUUID':
      return `El campo '${fieldname}' debe ser del tipo uuid.`;
    case 'IsNumber':
      return `El campo '${fieldname}' debe ser un numero y debe contener dos decimales.`;
    case 'IsArray':
      return `El campo '${fieldname}' debe ser de tipo arreglo".`;
    case 'ArrayNotEmpty':
      return `El arreglo '${fieldname}' debe contener al menos un elemento".`;
    case 'status':
      return `La venta no puede ser ${fieldname} porque tiene un estado que no lo permite.`;
    case 'IsDecimal':
      return `El campo '${fieldname}' debe ser un numero y debe contener dos decimales.`;
    case 'IsEnum':
      return `El campo '${fieldname}' debe ser 'automatic' o 'manual'.`;
    case 'IsEmail':
      return `El campo '${fieldname}' debe tener un formato correcto.`;
  }
}

export function numeroALetras(num: number, currency?: any): string {
  currency = currency || {};
  const data = {
    numero: num,
    enteros: Math.floor(num),
    centavos: Math.round(num * 100) - Math.floor(num) * 100,
    letrasCentavos: '',
    letrasMonedaPlural: currency.plural || 'DOLARES',
    letrasMonedaSingular: currency.singular || 'DOLAR',
    letrasMonedaCentavoPlural: currency.centPlural || 'CENTAVOS',
    letrasMonedaCentavoSingular: currency.centSingular || 'CENTAVO',
  };

  if (data.centavos == 100) {
    data.letrasCentavos = '00/100';
    data.enteros++;
  } else if (data.centavos > 0) {
    data.letrasCentavos = `${data.centavos.toString().length == 1 ? '0' : ''}${data.centavos}/100`;
  } else {
    data.letrasCentavos = '00/100';
  }

  if (data.enteros == 0) return 'CERO ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
  if (data.enteros == 1) return Millones(data.enteros) + ' ' + data.letrasMonedaSingular + ' ' + data.letrasCentavos;
  else return Millones(data.enteros) + ' ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;

  function Unidades(num) {
    switch (num) {
      case 1:
        return 'UN';
      case 2:
        return 'DOS';
      case 3:
        return 'TRES';
      case 4:
        return 'CUATRO';
      case 5:
        return 'CINCO';
      case 6:
        return 'SEIS';
      case 7:
        return 'SIETE';
      case 8:
        return 'OCHO';
      case 9:
        return 'NUEVE';
    }

    return '';
  }

  function Decenas(num) {
    const decena = Math.floor(num / 10);
    const unidad = num - decena * 10;

    switch (decena) {
      case 1:
        switch (unidad) {
          case 0:
            return 'DIEZ';
          case 1:
            return 'ONCE';
          case 2:
            return 'DOCE';
          case 3:
            return 'TRECE';
          case 4:
            return 'CATORCE';
          case 5:
            return 'QUINCE';
          default:
            return 'DIECI' + Unidades(unidad);
        }
      case 2:
        switch (unidad) {
          case 0:
            return 'VEINTE';
          default:
            return 'VEINTI' + Unidades(unidad);
        }
      case 3:
        return DecenasY('TREINTA', unidad);
      case 4:
        return DecenasY('CUARENTA', unidad);
      case 5:
        return DecenasY('CINCUENTA', unidad);
      case 6:
        return DecenasY('SESENTA', unidad);
      case 7:
        return DecenasY('SETENTA', unidad);
      case 8:
        return DecenasY('OCHENTA', unidad);
      case 9:
        return DecenasY('NOVENTA', unidad);
      case 0:
        return Unidades(unidad);
    }
  } //Unidades()

  function DecenasY(strSin, numUnidades) {
    if (numUnidades > 0) return strSin + ' Y ' + Unidades(numUnidades);

    return strSin;
  } //DecenasY()

  function Centenas(num) {
    const centenas = Math.floor(num / 100);
    const decenas = num - centenas * 100;

    switch (centenas) {
      case 1:
        if (decenas > 0) return 'CIENTO ' + Decenas(decenas);
        return 'CIEN';
      case 2:
        return 'DOSCIENTOS ' + Decenas(decenas);
      case 3:
        return 'TRESCIENTOS ' + Decenas(decenas);
      case 4:
        return 'CUATROCIENTOS ' + Decenas(decenas);
      case 5:
        return 'QUINIENTOS ' + Decenas(decenas);
      case 6:
        return 'SEISCIENTOS ' + Decenas(decenas);
      case 7:
        return 'SETECIENTOS ' + Decenas(decenas);
      case 8:
        return 'OCHOCIENTOS ' + Decenas(decenas);
      case 9:
        return 'NOVECIENTOS ' + Decenas(decenas);
    }

    return Decenas(decenas);
  } //Centenas()

  function Seccion(num, divisor, strSingular, strPlural) {
    const cientos = Math.floor(num / divisor);
    const resto = num - cientos * divisor;

    let letras = '';

    if (cientos > 0)
      if (cientos > 1) letras = Centenas(cientos) + ' ' + strPlural;
      else letras = strSingular;

    if (resto > 0) letras += '';

    return letras;
  } //Seccion()

  function Miles(num) {
    const divisor = 1000;
    const cientos = Math.floor(num / divisor);
    const resto = num - cientos * divisor;

    const strMiles = Seccion(num, divisor, 'UN MIL', 'MIL');
    const strCentenas = Centenas(resto);

    if (strMiles == '') return strCentenas;

    return strMiles + ' ' + strCentenas;
  } //Miles()

  function Millones(num) {
    const divisor = 1000000;
    const cientos = Math.floor(num / divisor);
    const resto = num - cientos * divisor;

    const strMillones = Seccion(num, divisor, 'UN MILLON DE', 'MILLONES DE');
    const strMiles = Miles(resto);

    if (strMillones == '') return strMiles;

    return strMillones + ' ' + strMiles;
  } //Millones()
}

export async function emailSender(to, subject, html) {
  try {
    const transporter = nodemailer.createTransport({
      host: 'email-smtp.sa-east-1.amazonaws.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: 'AKIAUF5XA5XBS47Z5FWT', // generated ethereal user
        pass: 'BHMYz/JBm1Ir2xqURjCjEbIsCMXbGma+rG21xRirD53P', // generated ethereal password
      },
    });
    const mailOptions = { from: '"Openbox Cloud" <no-reply@openbox.cloud>', to, subject, html };

    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Se ha enviado el correo correctamente.' };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: 'Correo electronico ingresado no es valido.',
    };
  }
}

export function applyMixins(derivedCtor: any, constructors: any[]) {
  constructors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name) || Object.create(null),
      );
    });
  });
}
