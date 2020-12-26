const express = require("express");
const { checkRequired, addLog } = require("../../tools");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const documents = await req.conn
      .getRepository("InvoicesDocument")
      .createQueryBuilder("id")
      .select([
        "id.id",
        "id.authorization",
        "id.initial",
        "id.final",
        "id.current",
        "id.active",
      ])
      .where("id.company = :company", { company: req.user.cid })
      .orderBy("id.createdAt", "DESC")
      .getMany();

    return res.json({
      documents: documents.map((d) => {
        return {
          ...d,
          next: d.current + 1,
        };
      }),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener el listado de documentos." });
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
      ])
      .where("id.company = :company", { company: req.user.cid })
      .andWhere("id.id = :id", { id: req.params.id })
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
