const express = require("express");
const { checkRequired } = require("../../tools");
const router = express.Router();

router.get("/general", async (req, res) => {
  try {
    //Obtiene la informacion del cliente
    const company = await req.conn
      .getRepository("Company")
      .createQueryBuilder("c")
      .select(["c.name", "c.nrc", "c.nit"])
      .where("c.id = :id", { id: req.user.cid })
      .getOne();

    //Obtiene el listado de servicios
    const services = await req.conn
      .getRepository("Service")
      .createQueryBuilder("s")
      .select(["s.name", "s.description", "s.cost", "st.name"])
      .where("s.company = :company", { company: req.user.cid })
      .leftJoin("s.sellingType", "st")
      .getMany();

    let index = 1
    return res.json({
      company,
      services: services.map(s => {
        return {
          index: index++,
          ...s
        }
      }),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message:
        "Error al obtener reporte solicitado. Contacta con tu administrador.",
    });
  }
});

module.exports = router;
