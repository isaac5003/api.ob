const express = require("express");
const { checkRequired, foundRelations, addLog } = require("../../tools");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const zones = await req.conn
      .getRepository("InvoicesZone")
      .createQueryBuilder("iz")
      .select(["iz.id", "iz.name", "iz.active"])
      .getMany();

    let index = 1;
    return res.json({
      zones: zones.map((z) => {
        return { index: index++, ...z };
      }),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener el listado de zonas." });
  }
});

module.exports = router;
