const express = require("express");
const { checkRequired } = require("../../tools");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const documentTypes = await req.conn
      .getRepository("InvoicesDocumentType")
      .createQueryBuilder("idt")
      .select(["idt.id", "idt.name", "idt.code"])
      .orderBy("idt.createdAt", "DESC")
      .getMany();

    return res.json({
      documentTypes,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener el lidttado de tipos de documento." });
  }
});

module.exports = router;
