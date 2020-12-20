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
      .getRepository("InvoicesZone")
      .createQueryBuilder("iz")
      .where("iz.company = :company", { company: cid })
      .select("COUNT(iz.id)", "count");

    if (active != null) {
      query = query.andWhere("iz.active = :active", {
        active: active == "true",
      });
    }

    let { count } = await query.getRawOne();

    let zones = req.conn
      .getRepository("InvoicesZone")
      .createQueryBuilder("iz")
      .select([ "iz.id", "iz.name", 'iz.active'])
      .where("iz.company = :company", { company: cid })
      .orderBy("iz.createdAt", "DESC");

    let index = 1;
    if (search == null) {
      zones = zones
        .limit(limit)
        .offset(limit ? parseInt(page ? page - 1 : 0) * parseInt(limit) : null);
      index = index * page ? (page - 1) * limit + 1 : 1;
    }

    if (active != null) {
      zones = zones.andWhere("s.active = :active", {
        active: active == "true",
      });
    }
    zones = await zones.getMany();

    if (search != null) {
      zones = zones.filter((s) => s.name.toLowerCase().includes(search));
      count = zones.length;
    }

    return res.json({
      count,
      zones: zones.map((s) => {
        return { index: index++, ...s };
      }),
    });
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ message: "Error al obtener el listado de zonas." });
  }
});

router.post("/", async (req, res) => {
  // Verifica los campos requeridos
  const check = checkRequired(req.body, ['name']);
  if (!check.success) {
    return res.status(400).json({ message: check.message });
  }

  // Obtiene los campos requeridos
  const { name } = req.body;

  // Inserta el servicio
  try {
    const zone = await req.conn
      .createQueryBuilder()
      .insert()
      .into("InvoicesZone")
      .values({ 
        name,
        company: req.user.cid
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
      `Se ha creado la zona: ${name}`
    );

    // On success
    return res.json({
      message: "La zona se ha creado correctamente.",
      id: zone.raw[0].id,
    });
  } catch (error) {
    // On errror
    return res.status(400).json({
      message:
        "Error al guardar la nueva zona, contacta con tu administrador.",
    });
  }
});

router.put("/:id", async (req, res) => {
  // Verifica los campos requeridos
  const check = checkRequired(req.body, [ "name" ]);
  if (!check.success) {
    return res.status(400).json({ message: check.message });
  }

  // Obtiene los campos requeridos
  const { name } = req.body;

  // Actualiza el servicio
  try {
    await req.conn
      .createQueryBuilder()
      .update("InvoicesZone")
      .set({ name })
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
      `Se ha editado la zona: ${name}`
    );

    // On success
    return res.json({
      message: "La zona ha sido actualizada correctamente.",
    });
  } catch (error) {
    // On errror
    return res.status(400).json({
      message:
        "Error al actualizar la zona, contacta con tu administrador.",
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
  .getRepository("InvoicesZone")
  .createQueryBuilder("iz")
  .where("iz.company = :company", { company: req.user.cid })
  .andWhere("iz.id = :id", { id: req.params.id })
  .getOne();
  
  // If no exist
  if (!zone) {
    return res
      .status(400)
      .json({ message: "La zona seleccionada no existe." });
  }

  // If zone exist updates it
  try {
    // return success
    await req.conn
      .createQueryBuilder()
      .update("InvoicesZone")
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
      `Se cambio el estado de la zona: ${zone.name} a ${
        status ? "ACTIVO" : "INACTIVO"
      }.`
    );

    return res.json({
      message: "La zona ha sido actualizado correctamente.",
    });
  } catch (error) {
    // return error
    return res.status(500).json({
      message:
        "Error al actualizar la zona. Contacta con tu administrador.",
    });
  }
});

router.delete("/:id", async (req, res) => {
  // Get the zone
  const zone = await req.conn
    .getRepository("InvoicesZone")
    .createQueryBuilder("s")
    .where("s.company = :company", { company: req.user.cid })
    .andWhere("s.id = :id", { id: req.params.id })
    .getOne();

  // If no zone exist
  if (!zone) {
    return res.status(400).json({ message: "la zona ingresada no existe" });
  }

  // If zone exist
  // Check references in other tables
  const references = await foundRelations(req.conn, "invoices_zone", zone.id, [], 'invoicesZone');

  // if references rejects deletion
  if (references) {
    return res.status(400).json({
      message:
        "La zona no puede ser eliminada porque esta siendo utilizado en el sistema.",
    });
  }

  // If no references deletes
  try {
    await req.conn
      .createQueryBuilder()
      .delete()
      .from("InvoicesZone")
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
      `Se elimino la zona con nombre: ${zone.name}.`
    );

    return res.json({
      message: "La zona ha sido eliminada correctamente.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al eliminar la zona. Conctacta a tu administrador.",
    });
  }
});

module.exports = router;
