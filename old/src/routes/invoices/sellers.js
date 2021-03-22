const express = require("express");
const { checkRequired, foundRelations, addLog } = require("../../tools");
const router = express.Router();

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

    let query = req.conn
      .getRepository("InvoicesSeller")
      .createQueryBuilder("is")
      .where("is.company = :company", { company: cid })
      .select("COUNT(is.id)", "count");

    if (active != null) {
      query = query.andWhere("is.active = :active", {
        active: active == "true",
      });
    }

    let { count } = await query.getRawOne();

    let sellers = req.conn
      .getRepository("InvoicesSeller")
      .createQueryBuilder("is")
      .leftJoin("is.invoicesZone", "iz")
      .select(["is.id", "is.name", "is.active", "iz.id", "iz.name"])
      .where("is.company = :company", { company: cid })
      .orderBy("is.createdAt", "DESC");

    let index = 1;
    if (search == null) {
      sellers = sellers
        .limit(limit)
        .offset(limit ? parseInt(page ? page - 1 : 0) * parseInt(limit) : null);
      index = index * page ? (page - 1) * limit + 1 : 1;
    }

    if (active != null) {
      sellers = sellers.andWhere("is.active = :active", {
        active: active == "true",
      });
    }
    sellers = await sellers.getMany();

    if (search != null) {
      sellers = sellers.filter((s) => s.name.toLowerCase().includes(search));
      count = sellers.length;
    }

    return res.json({
      count,
      sellers: sellers.map((s) => {
        return { index: index++, ...s };
      }),
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error al obtener el listado de vendedores." });
  }
});

router.post("/", async (req, res) => {
  // Verifica los campos requeridos
  const check = checkRequired(req.body, ["name", "invoicesZone"]);
  if (!check.success) {
    return res.status(400).json({ message: check.message });
  }

  // Obtiene los campos requeridos
  const { name, invoicesZone } = req.body;

  // Inserta el servicio
  try {
    const zone = await req.conn
      .createQueryBuilder()
      .insert()
      .into("InvoicesSeller")
      .values({
        name,
        invoicesZone,
        company: req.user.cid,
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
      `Se ha creado el vendedor: ${name}`
    );

    // On success
    return res.json({
      message: "El vendedor se ha creado correctamente.",
      id: zone.raw[0].id,
    });
  } catch (error) {
    // On errror
    return res.status(400).json({
      message:
        "Error al guardar el nuevo vendedor, contacta con tu administrador.",
    });
  }
});

router.put("/:id", async (req, res) => {
  // Verifica los campos requeridos
  const check = checkRequired(req.body, ["name", "invoicesZone"]);
  if (!check.success) {
    return res.status(400).json({ message: check.message });
  }

  // Obtiene los campos requeridos
  const { name, invoicesZone } = req.body;

  // Actualiza el servicio
  try {
    await req.conn
      .createQueryBuilder()
      .update("InvoicesSeller")
      .set({ name, invoicesZone })
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
      `Se ha editado El vendedor: ${name}`
    );

    // On success
    return res.json({
      message: "El vendedor ha sido actualizado correctamente.",
    });
  } catch (error) {
    // On errror
    return res.status(400).json({
      message:
        "Error al actualizar el vendedor, contacta con tu administrador.",
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

  // Get zone
  const zone = await req.conn
    .getRepository("InvoicesSeller")
    .createQueryBuilder("is")
    .where("is.company = :company", { company: req.user.cid })
    .andWhere("is.id = :id", { id: req.params.id })
    .getOne();

  // If no exist
  if (!zone) {
    return res
      .status(400)
      .json({ message: "El vendedor seleccionado no existe." });
  }

  // If zone exist updates it
  try {
    // return success
    await req.conn
      .createQueryBuilder()
      .update("InvoicesSeller")
      .set({ active: status })
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
      `Se cambio el estado del vendedor: ${zone.name} a ${
        status ? "ACTIVO" : "INACTIVO"
      }.`
    );

    return res.json({
      message: "El vendedor ha sido actualizado correctamente.",
    });
  } catch (error) {
    // return error
    return res.status(500).json({
      message:
        "Error al actualizar el vendedor. Contacta con tu administrador.",
    });
  }
});

router.delete("/:id", async (req, res) => {
  // Get the zone
  const zone = await req.conn
    .getRepository("InvoicesSeller")
    .createQueryBuilder("s")
    .where("s.company = :company", { company: req.user.cid })
    .andWhere("s.id = :id", { id: req.params.id })
    .getOne();

  // If no zone exist
  if (!zone) {
    return res.status(400).json({ message: "El vendedor ingresado no existe" });
  }

  // If zone exist
  // Check references in other tables
  const references = await foundRelations(
    req.conn,
    "invoices_seller",
    zone.id,
    [],
    "invoicesSeller"
  );

  // if references rejects deletion
  if (references) {
    return res.status(400).json({
      message:
        "El vendedor no puede ser eliminado porque esta siendo utilizado en el sistema.",
    });
  }

  // If no references deletes
  try {
    await req.conn
      .createQueryBuilder()
      .delete()
      .from("InvoicesSeller")
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
      `Se elimino el vendedor con nombre: ${zone.name}.`
    );

    return res.json({
      message: "El vendedor ha sido eliminado correctamente.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al eliminar el vendedor. Conctacta a tu administrador.",
    });
  }
});

module.exports = router;
