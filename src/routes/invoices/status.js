const express = require("express");
const { checkRequired } = require("../../tools");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const statuses = await req.conn
      .getRepository("InvoicesStatus")
      .createQueryBuilder("is")
      .select(["is.id", "is.name"])
      .getMany();

    return res.json({ statuses });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener el listado de los documentos." });
  }
});

module.exports = router;
