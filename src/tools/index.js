const { isEmpty } = require("ramda");

const checkRequired = function (object, fields, nonrequired = false) {
  // Define incomplete fields response
  const response = { success: false, message: "Campos incompletos." };

  // Function to validate types
  function checkType(value, type) {
    switch (type) {
      case "date":
        const RegDate = /[0-9]{4}-[0-9]{2}-[0-9]{2}/;
        return {
          success: RegDate.test(value) && isValid(new Date(value)),
          message: "debe ser YYYY-MM-DD",
        };
        break;
      case "us-phone":
        const RegUSPhone = /^[2-9]\d{2}\d{3}\d{4}$/;
        return {
          success: RegUSPhone.test(value),
          message: "deben ser 10 digitos seguidos de numero de telefono valido",
        };
        break;
      case "email":
        const RegEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return {
          success: RegEmail.test(value),
          message: "Debe ser un correo válido.",
        };
        break;
      case "array":
        return {
          success: Array.isArray(value) && value.length > 0,
          message: "Debe ser un arreglo y no ser vacio",
        };
        break;
      case "slug":
        return {
          success: !value.includes(" "),
          message: "un slug no debe incluir espacios",
        };
      case "integer":
        const parsed = parseInt(value);
        return {
          success: value == parsed && Number.isInteger(parsed),
          message: "debe ser un número entero.",
        };
        break;
      case "boolean":
        return {
          success: value != "true" || value != "false",
          message: "debe ser un número booleano.",
        };
        break;
      default:
        return { success: true };
        break;
    }
  }

  // Check if empty object
  if (isEmpty(object)) {
    // Check if all fields are not required
    if (nonrequired) return { success: true };
    return { success: false, message: "Ningún campo recibido." };
  }

  // Loops over all fields
  for (const field of fields) {
    if (typeof field == "object") {
      // if field field is object
      if (object.hasOwnProperty(field.name)) {
        const checked = checkType(object[field.name], field.type);
        if (!checked.success)
          return {
            success: false,
            message: `El campo ${field.name} tiene un formato incorrecto, ${checked.message}`,
          };
      } else {
        if (!field.optional) return response;
      }
    } else {
      // check if the field is comming in the object provided
      if (!object.hasOwnProperty(field)) return response;
    }
  }
  return { success: true };
};

const addLog = async (conn, module, userName, userID, detail) => {
  try {
    await conn
      .createQueryBuilder()
      .insert()
      .into("Logger")
      .values({ userID, userName, module, detail })
      .execute();
  } catch (error) {
    console.log(error);
  }
};

const foundRelations = async (conn, table_name, id) => {
  // Get a list of tables related to table_name
  let relations = await conn.query(
    `select table_name from information_schema.table_constraints where constraint_name in (SELECT constraint_name from information_schema.constraint_column_usage where table_name = '${table_name}' and constraint_name like 'FK_%')`
  );
  relations = relations.map((r) => r.table_name);

  // created a subquery for each table found
  const subquery = [];
  for (const r of relations) {
    subquery.push(
      `select count(*) from ${r} where "${table_name}Id" = '${id}'`
    );
  }

  const [result] = await conn.query(subquery.join(" union all "));
  return result.count > 0;
};

module.exports = {
  access_key:
    "mDsDkZcsjnux*bOBRfBaf%LN8sMkxf*2s7QSvUD1$RIlDJn0&GclG5#8BRV$KNqW4Zx@jo8j4sK7bmtPHqUTjD^rvc^%eIhdh4W",
  refresh_key:
    "mDsDkZcsjnux*bOBRfBaf%LN8sMkxf*2s7QSvUD1$RIlDJn0&GclG5#8BRV$KNqW4Zx@jo8j4sK7bmtPHqUTjD^rvc^%eIhdh4W",
  checkRequired,
  addLog,
  foundRelations,
  connection: {
    type: "postgres",
    host: "localhost",
    port: 5000,
    username: "openbox_user",
    password: "super_complicated_password",
    database: "openbox_database",
    synchronize: true,
    logging: false,
    entities: [
      require("../entities/Token"),
      require("../entities/Country"),
      require("../entities/State"),
      require("../entities/City"),
      require("../entities/User"),
      require("../entities/Profile"),
      require("../entities/Gender"),
      require("../entities/Logger"),
      require("../entities/Module"),
      require("../entities/CompanyType"),
      require("../entities/NaturalType"),
      require("../entities/TaxerType"),
      require("../entities/Company"),
      require("../entities/Branch"),
      require("../entities/Access"),
      require("../entities/SellingType"),
      require("../entities/Service"),
      require("../entities/Customer"),
      require("../entities/CustomerBranch"),
      require("../entities/CustomerType"),
      require("../entities/CustomerTypeNatural"),
      require("../entities/CustomerTaxerType"),
    ],
  },
};
