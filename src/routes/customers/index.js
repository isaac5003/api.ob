const express = require("express");
const { checkRequired, foundRelations, addLog } = require("../../tools");
const router = express.Router();

router.use((req, res, next) => {
  req.moduleName = "Customers";
  next();
});

router.get("/customer-types", async (req, res) => {
  try {
    const types = await req.conn
      .getRepository("CustomerType")
      .createQueryBuilder("s")
      .select(["s.id", "s.name"])
      .getMany();

    return res.json({ types });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener el listado de tipos de cliente." });
  }
});

router.get("/customer-taxer-types", async (req, res) => {
  try {
    const taxerTypes = await req.conn
      .getRepository("CustomerTaxerType")
      .createQueryBuilder("s")
      .select(["s.id", "s.name"])
      .getMany();

    return res.json({ taxerTypes });
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener el listado de tipos de tributaciones.",
    });
  }
});

router.get("/customer-type-naturals", async (req, res) => {
  try {
    const typeNaturals = await req.conn
      .getRepository("CustomerTypeNatural")
      .createQueryBuilder("s")
      .select(["s.id", "s.name"])
      .getMany();

    return res.json({ typeNaturals });
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener el listado de tipos de cliente naturales.",
    });
  }
});

router.get("/", async (req, res) => {
  const check = checkRequired(
    req.query,
    [
      { name: "limit", type: "integer", optional: true },
      { name: "page", type: "integer", optional: true },
      { name: "active", type: "boolean", optional: true },
      { name: "search", type: "string", optional: true },
    ],
    true
  );
  if (!check.success) {
    return res.status(400).json({ message: check.message });
  }

  try {
    const { cid } = req.user;
    const { limit, page, active, search } = req.query;

    // Obtiene el total de clientes
    let query = req.conn
      .getRepository("Customer")
      .createQueryBuilder("c")
      .where("c.company = :company", { company: cid })
      .andWhere("c.isCustomer = :isCustomer", { isCustomer: true })
      .select("COUNT(c.id)", "count");

    if (active != null) {
      query = query.andWhere("c.isActiveCustomer = :active", {
        active: active == "true",
      });
    }

    let { count } = await query.getRawOne();

    // Obtiene los clientes paginados o no
    let customers = req.conn
      .getRepository("Customer")
      .createQueryBuilder("c")
      .select([
        "c.id",
        "c.name",
        "c.nit",
        "c.nrc",
        "c.isActiveCustomer",
        "ct.name",
      ])
      .where("c.company = :company", { company: cid })
      .andWhere("c.isCustomer = :isCustomer", { isCustomer: true })
      .leftJoin("c.customerType", "ct")
      .orderBy("c.createdAt", "DESC");

    // Si el parametro esta nulo entonces pagina
    let index = 1;
    if (search == null) {
      customers = customers
        .limit(limit)
        .offset(limit ? parseInt(page ? page - 1 : 0) * parseInt(limit) : null);
      index = index * page ? (page - 1) * limit + 1 : 1;
    }

    if (active != null) {
      customers = customers.andWhere("c.isActiveCustomer = :active", {
        active: active == "true",
      });
    }
    customers = await customers.getMany();

    if (search != null) {
      customers = customers.filter((s) => {
        return s.name.toLowerCase().includes(search);
      });
      count = customers.length;
    }

    return res.json({
      count,
      customers: customers.map((c) => {
        return { index: index++, ...c };
      }),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener el listado de clientes." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const customer = await req.conn
      .getRepository("Customer")
      .createQueryBuilder("c")
      .select([
        "c.id",
        "c.name",
        "c.shortName",
        "c.isProvider",
        "c.isActiveCustomer",
        "c.dui",
        "c.nit",
        "c.nrc",
        "c.giro",
        "ct.id",
        "ct.name",
        "ctn.id",
        "ctn.name",
        "ctt.id",
        "ctt.name",
        "cb.address1",
        "cb.address2",
        "cb.contactName",
        "cb.contactInfo",
        "co.id",
        "co.name",
        "st.id",
        "st.name",
        "ci.id",
        "ci.name",
      ])
      .where("c.company = :company", { company: req.user.cid })
      .andWhere("c.id = :id", { id: req.params.id })
      .leftJoin("c.customerType", "ct")
      .leftJoin("c.customerTypeNatural", "ctn")
      .leftJoin("c.customerTaxerType", "ctt")
      .leftJoin("c.customerBranches", "cb")
      .leftJoin("cb.country", "co")
      .leftJoin("cb.state", "st")
      .leftJoin("cb.city", "ci")
      .getOne();

    if (!customer) {
      return res
        .status(400)
        .json({ message: "El cliente seleccionado no existe." });
    }

    return res.json({ customer });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener el cliente seleccionado." });
  }
});

router.post("/", async (req, res) => {
  // verifica los campos requeridos
  const check = checkRequired(req.body, [
    "name",
    "shortName",
    { name: "isProvider", type: "boolean", optional: false },
    { name: "dui", optional: true },
    { name: "nrc", optional: true },
    { name: "nit", optional: true },
    { name: "giro", optional: true },
    { name: "customerType", type: "integer" },
    { name: "customerTaxerType", type: "integer", optional: true },
    { name: "customerTypeNatural", optional: true },
    "branch",
  ]);
  if (!check.success) {
    return res.status(400).json({ message: check.message });
  }

  const check_branch = checkRequired(req.body.branch, [
    "contactName",
    { name: "contactInfo", optional: true },
    "address1",
    { name: "address2", optional: true },
    "country",
    "state",
    "city",
  ]);
  if (!check_branch.success) {
    return res.status(400).json({ message: check_branch.message });
  }

  // crea el cliente
  try {
    // obtiene los campos requeridos
    let {
      name,
      shortName,
      isProvider,
      dui,
      nrc,
      nit,
      giro,
      customerType,
      customerTaxerType,
      customerTypeNatural,
    } = req.body;

    const customer = await req.conn
      .createQueryBuilder()
      .insert()
      .into("Customer")
      .values({
        name,
        shortName,
        isProvider,
        isCustomer: true,
        dui,
        nrc,
        nit,
        giro,
        isActiveProvider: false,
        company: req.user.cid,
        customerTaxerType,
        customerType,
        customerTypeNatural,
      })
      .execute();

    const user = await req.conn
      .getRepository("User")
      .createQueryBuilder("u")
      .where("u.id = :id", { id: req.user.uid })
      .getOne();

    await addLog(
      req.conn,
      req.moduleName,
      `${user.names} ${user.lastnames}`,
      user.id,
      `Se ha creado el cliente: ${name}`
    );

    // crea sucursal
    try {
      // obtiene los campos requeridos
      let {
        contactName,
        contactInfo,
        address1,
        address2,
        country,
        state,
        city,
      } = req.body.branch;

      await req.conn
        .createQueryBuilder()
        .insert()
        .into("CustomerBranch")
        .values({
          name: "Sucursal Principal",
          contactName,
          contactInfo,
          address1,
          address2,
          customer: customer.raw[0].id,
          country,
          state,
          city,
        })
        .execute();

      await addLog(
        req.conn,
        req.moduleName,
        `${user.names} ${user.lastnames}`,
        user.id,
        `Se ha creado la sucursal: Sucursal Principal`
      );

      return res.json({
        message: "Se ha creado el cliente correctamente.",
        id: customer.raw[0].id,
      });
    } catch (error) {
      // on error
      return res.status(500).json({
        message:
          "Error al crear la sucursal del cliente. Contacta con tu administrador.",
      });
    }
  } catch (error) {
    // on error
    return res.status(500).json({
      message: "Error al crear el cliente. Contacta con tu administrador",
    });
  }
});

router.put("/status/:id", async (req, res) => {
  // Check required field
  const check = checkRequired(req.body, ["status"]);
  if (!check.success) {
    return res.status(400).json({ message: check.message });
  }

  // Get field
  const { status } = req.body;

  // Get customer
  const customer = await req.conn
    .getRepository("Customer")
    .createQueryBuilder("c")
    .where("c.company = :company", { company: req.user.cid })
    .andWhere("c.id = :id", { id: req.params.id })
    .getOne();

  // If no exist
  if (!customer) {
    return res
      .status(400)
      .json({ message: "El cliente seleccionado no existe." });
  }

  // If customer exist updates it
  try {
    // return success
    await req.conn
      .createQueryBuilder()
      .update("Customer")
      .set({ isActiveCustomer: status })
      .where("company = :company", { company: req.user.cid })
      .where("id = :id", { id: req.params.id })
      .execute();

    const user = await req.conn
      .getRepository("User")
      .createQueryBuilder("u")
      .where("u.id = :id", { id: req.user.uid })
      .getOne();

    await addLog(
      req.conn,
      req.moduleName,
      `${user.names} ${user.lastnames}`,
      user.id,
      `Se cambio el estado del cliente: ${customer.name} a ${
        status ? "ACTIVO" : "INACTIVO"
      }.`
    );

    return res.json({
      message: "El cliente ha sido actualizado correctamente.",
    });
  } catch (error) {
    // return error
    return res.status(500).json({
      message: "Error al actualizar el cliente. Contacta con tu administrador.",
    });
  }
});

router.delete("/:id", async (req, res) => {
  // Get the customer
  const customer = await req.conn
    .getRepository("Customer")
    .createQueryBuilder("c")
    .where("c.company = :company", { company: req.user.cid })
    .andWhere("c.id = :id", { id: req.params.id })
    .getOne();

  // If no customer exist
  if (!customer) {
    return res.status(400).json({ message: "El cliente ingresado no existe" });
  }

  // If customer exist
  // Check references in other tables
  const references = await foundRelations(req.conn, "customer", customer.id);

  // if references rejects deletion
  if (references) {
    return res.status(400).json({
      message:
        "El cliente no puede ser eliminado porque esta siendo utilizado en el sistema.",
    });
  }

  // If no references deletes
  try {
    await req.conn
      .createQueryBuilder()
      .delete()
      .from("Customer")
      .where("id = :id", { id: req.params.id })
      .andWhere("company = :company", { company: req.user.cid })
      .execute();

    const user = await req.conn
      .getRepository("User")
      .createQueryBuilder("u")
      .where("u.id = :id", { id: req.user.uid })
      .getOne();

    await addLog(
      req.conn,
      req.moduleName,
      `${user.names} ${user.lastnames}`,
      user.id,
      `Se elimino el cliente con nombre: ${customer.name}.`
    );

    return res.json({
      message: "El cliente ha sido eliminado correctamente.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error al eliminar el cliente. Conctacta a tu administrador.",
    });
  }
});

module.exports = router;
