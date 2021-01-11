const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const entryTypes = await req.conn
      .getRepository("AccountingEntryType")
      .createQueryBuilder("aet")
      .select(["aet.id", "aet.name", "aet.code"])
      .where("aet.company = :company", { company: req.user.cid })
      .orderBy("aet.createdAt", "DESC")
      .getMany();

    return res.json({
      entryTypes,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener el listado de tipos de partida." });
  }
});

module.exports = router;
