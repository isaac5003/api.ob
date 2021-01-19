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
      { name: "type", type: "integer", optional: true },
      { name: "search", type: "string", optional: true },
    ],
    true
  );
  if (!check.success) {
    return res.status(400).json({ message: check.message });
  }

  try {
    const { cid } = req.user;
    const { limit, page, active, type, search } = req.query;

    let query = req.conn
      .getRepository("Service")
      .createQueryBuilder("s")
      .where("s.company = :company", { company: cid })
      .select("COUNT(s.id)", "count");

    if (active != null) {
      query = query.andWhere("s.active = :active", {
        active: active == "true",
      });
    }
    if (type != null) {
      query = query.andWhere("s.sellingType = :sellingType", {
        sellingType: type,
      });
    }

    let { count } = await query.getRawOne();

    let services = req.conn
      .getRepository("Service")
      .createQueryBuilder("s")
      .select([
        "s.id",
        "s.name",
        "s.description",
        "s.cost",
        "s.active",
        "s.active",
        "st.id",
        "st.name",
      ])
      .where("s.company = :company", { company: cid })
      .leftJoin("s.sellingType", "st")
      .orderBy("s.createdAt", "DESC");

    let index = 1;
    if (search == null) {
      services = services
        .limit(limit)
        .offset(limit ? parseInt(page ? page - 1 : 0) * parseInt(limit) : null);
      index = index * page ? (page - 1) * limit + 1 : 1;
    }

    if (active != null) {
      services = services.andWhere("s.active = :active", {
        active: active == "true",
      });
    }
    if (type != null) {
      services = services.andWhere("s.sellingType = :sellingType", {
        sellingType: type,
      });
    }
    services = await services.getMany();

    if (search != null) {
      services = services.filter((s) => {
        return (
          s.name.toLowerCase().includes(search) ||
          s.description.toLowerCase().includes(search) ||
          s.cost.toString().toLowerCase().includes(search) ||
          s.sellingType.name.toLowerCase().includes(search)
        );
      });
      count = services.length;
    }

    return res.json({
      count,
      services: services.map((s) => {
        return { index: index++, ...s };
      }),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener el listado de servicios." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const service = await req.conn
      .getRepository("Service")
      .createQueryBuilder("s")
      .select([
        "s.id",
        "s.name",
        "s.description",
        "s.cost",
        "s.active",
        "st.id",
        "st.name",
      ])
      .where("s.company = :company", { company: req.user.cid })
      .andWhere("s.id = :id", { id: req.params.id })
      .leftJoin("s.sellingType", "st")
      .getOne();

    if (!service) {
      return res
        .status(400)
        .json({ message: "El servicio seleccionado no existe." });
    }

    return res.json({ service });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener el servicio seleccionado." });
  }
});

router.post("/", async (req, res) => {
  // Verifica los campos requeridos
  const check = checkRequired(req.body, [
    "name",
    "cost",
    "sellingType",
    "description",
  ]);
  if (!check.success) {
    return res.status(400).json({ message: check.message });
  }

  // Obtiene los campos requeridos
  const { name, cost, sellingType, description } = req.body;

  // Inserta el servicio
  try {
    const service = await req.conn
      .createQueryBuilder()
      .insert()
      .into("Service")
      .values({ name, cost, sellingType, description, company: req.user.cid })
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
      `Se ha creado el servicio: ${name}`
    );

    // On success
    return res.json({
      message: "El servicio se ha creado correctamente.",
      id: service.raw[0].id,
    });
  } catch (error) {
    // On errror
    return res.status(400).json({
      message:
        "Error al guardar el nuevo servicio, contacta con tu administrador.",
    });
  }
});

router.put("/:id", async (req, res) => {
  // Verifica los campos requeridos
  const check = checkRequired(req.body, [
    "name",
    "cost",
    "sellingType",
    "description",
  ]);
  if (!check.success) {
    return res.status(400).json({ message: check.message });
  }

  // Obtiene los campos requeridos
  const { name, cost, sellingType, description } = req.body;

  // Actualiza el servicio
  try {
    await req.conn
      .createQueryBuilder()
      .update("Service")
      .set({ name, cost, sellingType, description })
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
      `Se ha editado el servicio: ${name}`
    );

    // On success
    return res.json({
      message: "El servicio ha sido actualizado correctamente.",
    });
  } catch (error) {
    // On errror
    return res.status(400).json({
      message:
        "Error al actualizar el servicio, contacta con tu administrador.",
    });
  }
});

router.delete("/:id", async (req, res) => {
  // Get the order
  const service = await req.conn
    .getRepository("Service")
    .createQueryBuilder("s")
    .where("s.company = :company", { company: req.user.cid })
    .andWhere("s.id = :id", { id: req.params.id })
    .getOne();

  // If no order exist
  if (!service) {
    return res.status(400).json({ message: "El servicio ingresado no existe" });
  }

  // If order exist
  // Check references in other tables
  const references = await foundRelations(req.conn, "service", service.id);

  // if references rejects deletion
  if (references) {
    return res.status(400).json({
      message:
        "El servicio no puede ser eliminado porque esta siendo utilizado en el sistema.",
    });
  }

  // If no references deletes
  try {
    await req.conn
      .createQueryBuilder()
      .delete()
      .from("Service")
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
      `Se elimino el servicio con nombre: ${service.name}.`
    );

    return res.json({
      message: "El servicio ha sido eliminado correctamente.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error al eliminar el servicio. Conctacta a tu administrador.",
    });
  }
});

module.exports = router;
