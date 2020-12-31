const express = require("express");
const { format } = require("date-fns");
const { checkRequired, addLog } = require("../../tools");
const router = express.Router();

router.get("/", async (req, res) => {
  const check = checkRequired(
    req.query,
    [
      { name: "limit", type: "integer", optional: true },
      { name: "page", type: "integer", optional: true },
      { name: "search", type: "string", optional: true },
      { name: "documentType", type: "integer", optional: true },
      { name: "customer", type: "string", optional: true },
      { name: "seller", type: "string", optional: true },
      { name: "zone", type: "string", optional: true },
      { name: "service", type: "string", optional: true },
      { name: "status", type: "integer", optional: true },
      { name: "startDate", type: "date", optional: true },
      { name: "endDate", type: "date", optional: true },
      // TODO Servicio
    ],
    true
  );
  if (!check.success) {
    return res.status(400).json({ message: check.message });
  }

  try {
    const { cid } = req.user;
    const {
      limit,
      page,
      search,
      documentType,
      customer,
      seller,
      zone,
      service,
      status,
      startDate,
      endDate,
    } = req.query;

    let invoices = req.conn
      .getRepository("Invoice")
      .createQueryBuilder("i")
      .select([
        "i.id",
        "i.authorization",
        "i.sequence",
        "i.invoiceDate",
        "i.ventaTotal",
        "i.customerName",
        "st.name",
      ])
      .leftJoin("i.documentType", "dt")
      .leftJoin("i.customer", "cu")
      .leftJoin("i.invoicesSeller", "sl")
      .leftJoin("i.invoicesZone", "zo")
      .leftJoin("i.status", "st")
      .where("i.company = :company", { company: cid })
      .orderBy("i.createdAt", "DESC");

    let index = 1;
    if (!search) {
      invoices = invoices
        .limit(limit)
        .offset(limit ? parseInt(page ? page - 1 : 0) * parseInt(limit) : null);
      index = index * page ? (page - 1) * limit + 1 : 1;
    }

    if (documentType) {
      invoices = invoices.andWhere("dt.id = :documentType", { documentType });
    }
    if (customer) {
      invoices = invoices.andWhere("cu.id = :customer", { customer });
    }
    if (seller) {
      invoices = invoices.andWhere("sl.id = :seller", { seller });
    }
    if (zone) {
      invoices = invoices.andWhere("zo.id = :zone", { zone });
    }
    if (status) {
      invoices = invoices.andWhere("st.id = :status", { status });
    }
    if (startDate && endDate) {
      invoices = invoices.andWhere("i.invoiceDate >= :startDate", {
        startDate,
      });
      invoices = invoices.andWhere("i.invoiceDate <= :endDate", { endDate });
    }
    invoices = await invoices.getMany();

    let count = invoices.length;
    if (search != null) {
      invoices = invoices.filter(
        (s) =>
          s.authorization.toLowerCase().includes(search) ||
          s.sequence.toLowerCase().includes(search) ||
          format(new Date(s.invoiceDate), "dd/MM/yyyy")
            .toLowerCase()
            .includes(search) ||
          s.customerName.toLowerCase().includes(search) ||
          s.status.name.toLowerCase().includes(search)
      );
      count = invoices.length;
    }

    return res.json({
      count,
      invoices: invoices.map((i) => {
        return {
          index: index++,
          ...i,
          invoiceDate: format(new Date(i.invoiceDate), "dd/MM/yyyy"),
        };
      }),
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error al obtener el listado de ventas." });
  }
});

module.exports = router;
