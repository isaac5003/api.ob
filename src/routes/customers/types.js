const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const types = await req.conn
      .getRepository("CustomerType")
      .createQueryBuilder("s")
      .select(["s.id", "s.name"])
      .getMany();

    return res.json({ types });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener el listado de tipos de cliente." });
  }
});

module.exports = router;
