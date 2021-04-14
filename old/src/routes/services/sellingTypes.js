const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const types = await req.conn
      .getRepository("SellingType")
      .createQueryBuilder("s")
      .select(["s.id", "s.name"])
      .orderBy("s.id", 'DESC')
      .getMany();

    return res.json({ types });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener el listado de tipos de venta." });
  }
});

module.exports = router;
