const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const taxerTypes = await req.conn
      .getRepository("CustomerTaxerType")
      .createQueryBuilder("s")
      .select(["s.id", "s.name"])
      .getMany();

    return res.json({ taxerTypes });
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener el listado de tipos de tributaciones.",
    });
  }
});

module.exports = router;
