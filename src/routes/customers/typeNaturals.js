const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const typeNaturals = await req.conn
      .getRepository("CustomerTypeNatural")
      .createQueryBuilder("s")
      .select(["s.id", "s.name"])
      .getMany();

    return res.json({ typeNaturals });
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener el listado de tipos de cliente naturales.",
    });
  }
});

module.exports = router;
