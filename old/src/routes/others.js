const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
  req.moduleName = "Others";
  next();
});

router.get("/countries", async (req, res) => {
  try {
    const countries = await req.conn
      .getRepository("Country")
      .createQueryBuilder("c")
      .select(["c.id", "c.name"])
      .getMany();

    return res.json({ countries });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener el listado de paises." });
  }
});

router.get("/states", async (req, res) => {
  try {
    const states = await req.conn
      .getRepository("State")
      .createQueryBuilder("s")
      .select(["s.id", "s.name", "c.id", "c.name"])
      .leftJoin("s.country", "c")
      .getMany();

    return res.json({ states });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener el listado de departamentos." });
  }
});

router.get("/cities", async (req, res) => {
  try {
    const cities = await req.conn
      .getRepository("City")
      .createQueryBuilder("c")
      .select(["c.id", "c.name", "s.id", "s.name"])
      .leftJoin("c.state", "s")
      .getMany();

    return res.json({ cities });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener el listado de municipios." });
  }
});

module.exports = router;
