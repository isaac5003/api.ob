const express = require("express");
const router = express.Router({ mergeParams: true });

router.get("/", async (req, res) => {
  try {
    const branches = await req.conn
      .getRepository("CustomerBranch")
      .createQueryBuilder("cb")
      .select([
        "cb.id",
        "cb.name",
        "cb.default",
        "cb.address1",
        "cb.address2",
        "co.name",
        "st.name",
        "ct.name",
      ])
      .leftJoin("cb.country", "co")
      .leftJoin("cb.state", "st")
      .leftJoin("cb.city", "ct")
      .where("cb.customer = :customer", { customer: req.params.customerId })
      .getMany();

    return res.json({ branches });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error al obtener el listado de sucursales.",
    });
  }
});

module.exports = router;
