const express = require("express");
const { checkRequired } = require("../../tools");
const router = express.Router();

router.get("/", async (req, res) => {
  const check = checkRequired(
    req.query,
    [{ name: "search", type: "string", optional: true }],
    true
  );
  if (!check.success) {
    return res.status(400).json({ message: check.message });
  }

  try {
    const { search } = req.query;

    let accountingCatalog = await req.conn
      .getRepository("AccountingCatalog")
      .createQueryBuilder("ac")
      .select([
        "ac.id",
        "ac.code",
        "ac.name",
        "ac.isAcreedora",
        "ac.isBalance",
        "ac.isParent",
      ])
      .where("ac.company = :company", { company: req.user.cid })
      .orderBy("ac.code", "ASC")
      .getMany();

    if (search) {
      accountingCatalog = accountingCatalog.filter(
        (ac) =>
          ac.code.toLowerCase().includes(search) ||
          ac.name.toLowerCase().includes(search)
      );
    }

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
