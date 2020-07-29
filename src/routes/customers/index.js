const express = require("express");
const { checkRequired, foundRelations, addLog } = require("../../tools");
const router = express.Router();

router.use((req, res, next) => {
  req.moduleName = "Customers";
  next();
});

router.get("/customer-types", async (req, res) => {
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

router.get("/", async (req, res) => {
  const check = checkRequired(
    req.query,
    [
      { name: "limit", type: "integer", optional: true },
      { name: "page", type: "integer", optional: true },
      { name: "active", type: "boolean", optional: true },
      { name: "search", type: "string", optional: true },
    ],
    true
  );
  if (!check.success) {
    return res.status(400).json({ message: check.message });
  }

  try {
    const { cid } = req.user;
    const { limit, page, active, search } = req.query;

    // Obtiene el total de clientes
    let query = req.conn
      .getRepository("Customer")
      .createQueryBuilder("c")
      .where("c.company = :company", { company: cid })
      .andWhere("c.isCustomer = :isCustomer", { isCustomer: true })
      .select("COUNT(c.id)", "count");

    if (active != null) {
      query = query.andWhere("c.isActiveCustomer = :active", {
        active: active == "true",
      });
    }

    let { count } = await query.getRawOne();

    // Obtiene los clientes paginados o no
    let customers = req.conn
      .getRepository("Customer")
      .createQueryBuilder("c")
      .select([
        "c.id",
        "c.name",
        "c.nit",
        "c.nrc",
        "c.isActiveCustomer",
        "ct.name",
      ])
      .where("c.company = :company", { company: cid })
      .andWhere("c.isCustomer = :isCustomer", { isCustomer: true })
      .leftJoin("c.customerType", "ct")
      .orderBy("c.createdAt", "DESC");

    // Si el parametro esta nulo entonces pagina
    if (search == null) {
      customers = customers
        .limit(limit)
        .offset(limit ? parseInt(page ? page - 1 : 0) * parseInt(limit) : null);
    }

    if (active != null) {
      customers = customers.andWhere("c.isActiveCustomer = :active", {
        active: active == "true",
      });
    }
    customers = await customers.getMany();

    if (search != null) {
      customers = customers.filter((s) => {
        return s.name.toLowerCase().includes(search);
      });
      count = customers.length;
    }

    return res.json({ count, customers });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error al obtener el listado de clientes." });
  }
});

router.get("/:cid/branches", async (req, res) => {
  return res.json({
    branches: await req.conn
      .getRepository("CustomerBranch")
      .createQueryBuilder("cb")
      .where("cb.customer = :customer", {
        customer: req.params.cid,
      })
      .getMany(),
  });
});

module.exports = router;
