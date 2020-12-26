const express = require("express");
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

module.exports = router;
