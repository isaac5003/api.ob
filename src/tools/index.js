const { isValid } = require('date-fns');

const checkRequired = function(object, fields, nonrequired = false) {
  // Define incomplete fields response

  // Function to validate types
  function checkType(value, type) {
    switch (type) {
      case 'date':
        const RegDate = /[0-9]{4}-[0-9]{2}-[0-9]{2}/;
        return {
          success: RegDate.test(value) && isValid(new Date(value)),
          message: 'debe ser YYYY-MM-DD',
        };
      case 'us-phone':
        const RegUSPhone = /^[2-9]\d{2}\d{3}\d{4}$/;
        return {
          success: RegUSPhone.test(value),
          message: 'deben ser 10 digitos seguidos de numero de telefono valido',
        };
      case 'email':
        const RegEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return {
          success: RegEmail.test(value),
          message: 'Debe ser un correo válido.',
        };
      case 'array':
        return {
          success:
            (Array.isArray(value) || Array.isArray(JSON.parse(value))) &&
            (value.length > 0 || JSON.parse(value).length > 0),
          message: 'Debe ser un arreglo y no estar vacio',
        };
      case 'object':
        return {
          success: !Array.isArray(value) && typeof value === 'object' && value != null && Object.keys(value).length > 0,
          message: 'Debe ser un objeto y no estar vacio',
        };
      case 'slug':
        return {
          success: !value.includes(' '),
          message: 'un slug no debe incluir espacios',
        };
      case 'float':
        const parsedFloat = parseFloat(value);
        return {
          success: value == parsedFloat,
          message: 'debe ser un número flotante.',
        };
      case 'integer':
        const parsedInteger = parseInt(value);
        return {
          success: value == parsedInteger && Number.isInteger(parsedInteger),
          message: 'debe ser un número entero.',
        };
      case 'boolean':
        return {
          success: value != 'true' || value != 'false',
          message: 'debe ser un número booleano.',
        };
      default:
        return { success: true };
    }
  }

  // Check if empty object
  if (Object.keys(object).length == 0) {
    // Check if all fields are not required
    if (nonrequired) return { success: true };
    return { success: false, message: 'Ningún campo recibido.' };
  }

  // Loops over all fields
  for (const field of fields) {
    if (typeof field == 'object') {
      // if field field is object
      if (object.hasOwnProperty(field.name)) {
        const checked = checkType(object[field.name], field.type);
        if (!checked.success && object[field.name])
          return {
            success: false,
            message: `El campo ${field.name} tiene un formato incorrecto, ${checked.message}`,
          };
      } else {
        if (!field.optional)
          return {
            success: false,
            message: `El campo '${field.name}' de tipo '${field.type}' es requerido.`,
          };
      }
    } else {
      // check if the field is comming in the object provided
      if (!object.hasOwnProperty(field)) return { success: false, message: `El campo '${field}' es requerido.` };
    }
  }
  return { success: true };
};

const addLog = async (conn, module, userName, userID, detail) => {
  try {
    await conn
      .createQueryBuilder()
      .insert()
      .into('Logger')
      .values({ userID, userName, module, detail })
      .execute();
  } catch (error) {}
};

const foundRelations = async (conn, table_name, id, exeptions = [], field_name) => {
  // Get a list of tables related to table_name
  let relations = await conn.query(
    `select table_name from information_schema.table_constraints where constraint_name in (SELECT constraint_name from information_schema.constraint_column_usage where table_name = '${table_name}' and constraint_name like 'FK_%')`,
  );
  relations = relations.map(r => r.table_name).filter(r => !exeptions.includes(r));

  // created a subquery for each table found
  const subquery = [];
  for (const r of relations) {
    subquery.push(`select count(*) from ${r} where "${field_name ? field_name : table_name}Id" = '${id}'`);
  }
  let result = await conn.query(subquery.join(' union all '));
  return result == null ? false : result.reduce((a, b) => a + b.count, 0) > 0;
};

const numeroALetras = (num, currency) => {
  currency = currency || {};
  var data = {
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
    var decena = Math.floor(num / 10);
    var unidad = num - decena * 10;

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
    var centenas = Math.floor(num / 100);
    var decenas = num - centenas * 100;

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
    var cientos = Math.floor(num / divisor);
    var resto = num - cientos * divisor;

    var letras = '';

    if (cientos > 0)
      if (cientos > 1) letras = Centenas(cientos) + ' ' + strPlural;
      else letras = strSingular;

    if (resto > 0) letras += '';

    return letras;
  } //Seccion()

  function Miles(num) {
    var divisor = 1000;
    var cientos = Math.floor(num / divisor);
    var resto = num - cientos * divisor;

    var strMiles = Seccion(num, divisor, 'UN MIL', 'MIL');
    var strCentenas = Centenas(resto);

    if (strMiles == '') return strCentenas;

    return strMiles + ' ' + strCentenas;
  } //Miles()

  function Millones(num) {
    var divisor = 1000000;
    var cientos = Math.floor(num / divisor);
    var resto = num - cientos * divisor;

    var strMillones = Seccion(num, divisor, 'UN MILLON DE', 'MILLONES DE');
    var strMiles = Miles(resto);

    if (strMillones == '') return strMiles;

    return strMillones + ' ' + strMiles;
  } //Millones()
};

module.exports = {
  access_key: 'mDsDkZcsjnux*bOBRfBaf%LN8sMkxf*2s7QSvUD1$RIlDJn0&GclG5#8BRV$KNqW4Zx@jo8j4sK7bmtPHqUTjD^rvc^%eIhdh4W',
  refresh_key: 'mDsDkZcsjnux*bOBRfBaf%LN8sMkxf*2s7QSvUD1$RIlDJn0&GclG5#8BRV$KNqW4Zx@jo8j4sK7bmtPHqUTjD^rvc^%eIhdh4W',
  checkRequired,
  addLog,
  foundRelations,
  numeroALetras,
  connection: {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    synchronize: true,
    logging: false,
    entities: [
      require('../entities/Token'),
      require('../entities/Country'),
      require('../entities/State'),
      require('../entities/City'),
      require('../entities/User'),
      require('../entities/Profile'),
      require('../entities/Gender'),
      require('../entities/Logger'),
      require('../entities/Module'),
      require('../entities/CompanyType'),
      require('../entities/NaturalType'),
      require('../entities/TaxerType'),
      require('../entities/Company'),
      require('../entities/Branch'),
      require('../entities/Access'),
      require('../entities/SellingType'),
      require('../entities/Service'),
      require('../entities/Customer'),
      require('../entities/CustomerBranch'),
      require('../entities/CustomerType'),
      require('../entities/CustomerTypeNatural'),
      require('../entities/CustomerTaxerType'),
      require('../entities/InvoicesStatus'),
      require('../entities/InvoicesZone'),
      require('../entities/AccountingEntryType'),
      require('../entities/AccountingCatalog'),
      require('../entities/AccountingEntryDetail'),
      require('../entities/AccountingEntry'),
      require('../entities/InvoicesSeller'),
      require('../entities/InvoicesDocumentType'),
      require('../entities/InvoicesPaymentsCondition'),
      require('../entities/InvoicesDocument'),
      require('../entities/Invoice'),
      require('../entities/InvoiceDetail'),
      require('../entities/AccountingSetting'),
      require('../entities/ServiceSetting'),
    ],
  },
};
