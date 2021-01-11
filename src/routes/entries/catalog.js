const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const accountingCatalog = await req.conn
      .getRepository("AccountingCatalog")
      .createQueryBuilder("ac")
      .select(["ac.id", "ac.code", "ac.name", "ac.isAcreedora", "ac.isBalance"])
      .where("ac.company = :company", { company: req.user.cid })
      .getMany();

    return res.json({
      accountingCatalog,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener el listado de tipos de partida." });
  }
});

module.exports = router;
