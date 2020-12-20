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
    const general = await req.conn
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
    const accesses = await req.conn
      .getRepository("Access")
      .createQueryBuilder("a")
      .where("c.id = :id", { id: req.user.cid })
      .leftJoinAndSelect("a.company", "c")
      .leftJoinAndSelect("a.profile", "p")
      .leftJoinAndSelect("a.module", "m")
      .getMany();

    const profiles = new Set(accesses.map((a) => a.profile.id));
    const users = await req.conn
      .getRepository("User")
      .createQueryBuilder("u")
      .select([
        "u.names",
        "u.lastnames",
        "u.email",
        "u.isActive",
        "u.createdAt",
        "p.name",
        "p.admin",
      ])
      .where("p.id IN (:...profiles)", { profiles: [...profiles] })
      .leftJoin("u.profile", "p")
      .getMany();

    let modules = new Set(accesses.map((a) => a.module.id));
    modules = await req.conn
      .getRepository("Module")
      .createQueryBuilder("m")
      .select(["m.name", "m.description"])
      .where("id IN (:...modules)", { modules: [...modules] })
      .getMany();

    let uindex = 1;
    let mindex = 1;
    return res.json({
      general,
      users: users.map((u) => {
        return {
          index: uindex++,
          ...u,
          createdAt: format(u.createdAt, "dd/MM/yyyy"),
        };
      }),
      modules: modules.map((m) => {
        return {
          index: mindex++,
          ...m,
        };
      }),
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error al obtener la informacion del negocio." });
  }
});

module.exports = router;
