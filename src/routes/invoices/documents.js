const express = require("express");
const { checkRequired, addLog } = require("../../tools");
const router = express.Router();

router.get("/", async (req, res) => {
  const check = checkRequired(
    req.query,
    [
      { name: "limit", type: "integer", optional: true },
      { name: "page", type: "integer", optional: true },
      { name: "active", type: "boolean", optional: true },
      { name: "search", type: "string", optional: true },
      { name: "type", type: "integer", optional: true },
    ],
    true
  );
  if (!check.success) {
    return res.status(400).json({ message: check.message });
  }

  try {
    const { cid } = req.user;
    const { limit, page, active, search, type } = req.query;

    let query = req.conn
      .getRepository("InvoicesDocument")
      .createQueryBuilder("id")
      .where("id.company = :company", { company: cid })
      .leftJoin("id.documentType", "dt")
      .select("COUNT(id.id)", "count");

    if (active != null) {
      query = query.andWhere("dt.id = :type", { type });
    }
    if (type) {
      query = query.andWhere("id.active = :active", {
        active: active == "true",
      });
    }

    let { count } = await query.getRawOne();

    let documents = req.conn
      .getRepository("InvoicesDocument")
      .createQueryBuilder("id")
      .select([
        "id.id",
        "id.authorization",
        "id.initial",
        "id.final",
        "id.current",
        "id.active",
        "dt.id",
        "dt.name",
      ])
      .leftJoin("id.documentType", "dt")
      .where("id.company = :company", { company: cid })
      .orderBy("id.createdAt", "DESC");

    let index = 1;
    if (search == null) {
      documents = documents
        .limit(limit)
        .offset(limit ? parseInt(page ? page - 1 : 0) * parseInt(limit) : null);
      index = index * page ? (page - 1) * limit + 1 : 1;
    }

    if (active != null) {
      documents = documents.andWhere("id.active = :active", {
        active: active == "true",
      });
    }
    if (type) {
      documents = documents.andWhere("dt.id = :type", { type });
    }
    documents = await documents.getMany();

    if (search != null) {
      documents = documents.filter((s) =>
        s.name.toLowerCase().includes(search)
      );
      count = documents.length;
    }

    return res.json({
      count,
      documents: documents.map((s) => {
        return { index: index++, ...s };
      }),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener el listado de los documentos." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const document = await req.conn
      .getRepository("InvoicesDocument")
      .createQueryBuilder("id")
      .select([
        "id.id",
        "id.authorization",
        "id.initial",
        "id.final",
        "id.current",
        "id.active",
        "dt.id",
        "dt.name",
      ])
      .where("id.company = :company", { company: req.user.cid })
      .andWhere("id.id = :id", { id: req.params.id })
      .leftJoin("id.documentType", "dt")
      .orderBy("id.createdAt", "DESC")
      .getOne();

    return res.json({
      document: {
        ...document,
        next: document.current + 1,
      },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error al obtener el detalle del documento." });
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

  // Get document
  const document = await req.conn
    .getRepository("InvoicesDocument")
    .createQueryBuilder("id")
    .where("id.company = :company", { company: req.user.cid })
    .andWhere("id.id = :id", { id: req.params.id })
    .getOne();

  // If no exist
  if (!document) {
    return res
      .status(400)
      .json({ message: "El documento seleccionada no existe." });
  }

  // If document exist updates it
  try {
    // return success
    await req.conn
      .createQueryBuilder()
      .update("InvoicesDocument")
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
      `Se cambio el estado del documento: ${document.name} a ${
        status ? "ACTIVO" : "INACTIVO"
      }.`
    );

    return res.json({
      message: "El documento ha sido actualizado correctamente.",
    });
  } catch (error) {
    // return error
    console.log(error);
    return res.status(500).json({
      message:
        "Error al actualizar el documento. Contacta con tu administrador.",
    });
  }
});

module.exports = router;
