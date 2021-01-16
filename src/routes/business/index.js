const express = require("express");
const { product } = require("ramda");
const router = express.Router();
const { format } = require("date-fns");

router.use((req, res, next) => {
  req.moduleName = "Business";
  next();
});

router.get("/info", async (req, res) => {
  try {
    const info = await req.conn
      .getRepository("Company")
      .createQueryBuilder("c")
      .select([
        "c.name",
        "c.unique",
        "c.shortName",
        "c.outsourcer",
        "c.nrc",
        "c.nit",
        "c.dui",
        "c.giro",
        "ct.name",
        "tt.name",
        "nt.name",
      ])
      .where("c.id = :id", { id: req.user.cid })
      .leftJoin("c.companyType", "ct")
      .leftJoin("c.taxerType", "tt")
      .leftJoin("c.naturalType", "nt")
      .getOne();

    // Obtiene los accesos, brinda usuarios y modulos
    return res.json({
      info,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener la informacion del negocio." });
  }
});

module.exports = router;
