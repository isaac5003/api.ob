const express = require("express");
const router = express.Router({ mergeParams: true });

router.get("/", async (req, res) => {
  try {
    const customer = await req.conn
      .getRepository("Customer")
      .createQueryBuilder("c")
      .select([
        "c.dui",
        "c.nit",
        "c.nrc",
        "c.giro",
        "ct.name",
        "ctn.name",
        "ctt.name",
      ])
      .leftJoin("c.customerType", "ct")
      .leftJoin("c.customerTypeNatural", "ctn")
      .leftJoin("c.customerTaxerType", "ctt")
      .where("c.id = :id", { id: req.params.customerId })
      .getOne();

    return res.json({ customer });
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener el listado de sucursales.",
    });
  }
});

module.exports = router;
