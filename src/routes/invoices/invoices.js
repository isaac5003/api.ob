const express = require("express");
const { format } = require("date-fns");
const { checkRequired, addLog, numeroALetras } = require("../../tools");
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

router.get("/:id", async (req, res) => {
  try {
    const invoice = await req.conn
      .getRepository("Invoice")
      .createQueryBuilder("i")
      .select([
        "i.id",
        "i.authorization",
        "i.sequence",
        "i.invoiceDate",
        "i.customerName",
        "i.customerAddress1",
        "i.customerAddress2",
        "i.customerCountry",
        "i.customerState",
        "i.customerCity",
        "i.customerDui",
        "i.customerNit",
        "i.customerNrc",
        "i.customerGiro",
        "i.paymentConditionName",
        "i.sellerName",
        "i.zoneName",
        "i.sum",
        "i.iva",
        "i.subtotal",
        "i.ivaRetenido",
        "i.ventasExentas",
        "i.ventasNoSujetas",
        "i.ventaTotal",
        "i.ventaTotalText",
        "i.printedDate",
        "d.id",
        "d.chargeName",
        "d.chargeDescription",
        "d.quantity",
        "d.unitPrice",
        "d.incTax",
        "d.ventaPrice",
        "dsv.id",
        "dsv.name",
        "dst.id",
        "dst.name",
        "c.id",
        "c.name",
        "cb.id",
        "cb.name",
        "ct.id",
        "ct.name",
        "ctn.id",
        "ctn.name",
        "dt.id",
        "dt.name",
        "ipc.id",
        "ipc.name",
        "is.id",
        "is.name",
        "iz.id",
        "iz.name",
        "s.id",
        "s.name",
      ])
      .where("i.company = :company", { company: req.user.cid })
      .andWhere("i.id = :id", { id: req.params.id })
      .leftJoin("i.details", "d")
      .leftJoin("d.service", "dsv")
      .leftJoin("d.sellingType", "dst")
      .leftJoin("i.customer", "c")
      .leftJoin("i.customerBranch", "cb")
      .leftJoin("i.customerType", "ct")
      .leftJoin("i.customerTypeNatural", "ctn")
      .leftJoin("i.documentType", "dt")
      .leftJoin("i.invoicesPaymentsCondition", "ipc")
      .leftJoin("i.invoicesSeller", "is")
      .leftJoin("i.invoicesZone", "iz")
      .leftJoin("i.status", "s")
      .getOne();

    if (!invoice) {
      return res
        .status(400)
        .json({ message: "La venta seleccionada no existe." });
    }

    return res.json({
      invoice: {
        ...invoice,
        invoiceDate: format(new Date(invoice.invoiceDate), "dd/MM/yyyy"),
        printedDate: invoice.printedDate
          ? format(new Date(invoice.printedDate), "dd/MM/yyyy")
          : null,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener la venta seleccionada." });
  }
});

router.post("/", async (req, res) => {
  // valida los objetos header y details
  const check = checkRequired(req.body, [
    { name: "header", type: "object", optional: false },
    { name: "details", type: "array", optional: false },
  ]);
  if (!check.success) {
    return res.status(400).json({ message: check.message });
  }

  // valida el objeto header
  const checkHeader = checkRequired(req.body.header, [
    { name: "customer", optional: false },
    { name: "customerBranch", optional: false },
    { name: "invoicesSeller", optional: false },
    { name: "invoicesPaymentsCondition", optional: false },
    { name: "documentType", type: "integer", optional: false },
    { name: "authorization", type: "string", optional: false },
    { name: "sequence", type: "integer", optional: false },
    { name: "invoiceDate", type: "date", optional: false },
    { name: "sum", type: "float", optional: false },
    { name: "iva", type: "float", optional: false },
    { name: "subtotal", type: "float", optional: false },
    { name: "ivaRetenido", type: "float", optional: false },
    { name: "ventasExentas", type: "float", optional: false },
    { name: "ventasNoSujetas", type: "float", optional: false },
    { name: "ventaTotal", type: "float", optional: false },
  ]);
  if (!checkHeader.success) {
    return res.status(400).json({ message: checkHeader.message });
  }
  // valida el objeto details
  for (const details of req.body.details) {
    const checkDetails = checkRequired(details, [
      { name: "service", optional: false },
      { name: "chargeDescription", optional: false },
      { name: "quantity", type: "float", optional: false },
      { name: "unitPrice", type: "float", optional: false },
      { name: "incTax", type: "boolean", optional: false },
      { name: "ventaPrice", type: "float", optional: false },
    ]);
    if (!checkDetails.success) {
      return res.status(400).json({ message: checkDetails.message });
    }
  }

  const { header, details } = req.body;

  const document = await req.conn
    .getRepository("InvoicesDocument")
    .createQueryBuilder("id")
    .where("id.company = :company", { company: req.user.cid })
    .andWhere("dt.id = :documentType", { documentType: header.documentType })
    .leftJoin("id.documentType", "dt")
    .getOne();

  const customer = await req.conn
    .getRepository("Customer")
    .createQueryBuilder("c")
    .where("c.company = :company", { company: req.user.cid })
    .andWhere("c.id = :id", { id: header.customer })
    .getOne();

  const branch = await req.conn
    .getRepository("CustomerBranch")
    .createQueryBuilder("cb")
    .where("cb.customer = :customer", { customer: header.customer })
    .andWhere("cb.id = :id", { id: header.customerBranch })
    .leftJoinAndSelect("cb.country", "co")
    .leftJoinAndSelect("cb.state", "st")
    .leftJoinAndSelect("cb.city", "ci")
    .getOne();

  const condition = await req.conn
    .getRepository("InvoicesPaymentsCondition")
    .createQueryBuilder("pc")
    .where("pc.company = :company", { company: req.user.cid })
    .andWhere("pc.id = :id", { id: header.invoicesPaymentsCondition })
    .getOne();

  const seller = await req.conn
    .getRepository("InvoicesSeller")
    .createQueryBuilder("is")
    .where("is.company = :company", { company: req.user.cid })
    .andWhere("is.id = :id", { id: header.invoicesSeller })
    .leftJoinAndSelect("is.invoicesZone", "iz")
    .getOne();

  let message = "";
  const sequence = document.current;
  if (header.sequence != sequence) {
    message = `El numero de secuencia asignado fué: ${sequence}`;
  }

  const services = await req.conn
    .getRepository("Service")
    .createQueryBuilder("s")
    .select(["s.id", "s.name", "st.id"])
    .where("s.id IN (:...ids)", { ids: details.map((d) => d.service) })
    .leftJoin("s.sellingType", "st")
    .getMany();

  // inserta en Invoice
  let invoice = null;
  try {
    invoice = await req.conn
      .createQueryBuilder()
      .insert()
      .into("Invoice")
      .values({
        authorization: document.authorization,
        sequence,
        invoiceDate: header.invoiceDate,
        customerName: customer.name,
        customerAddress1: branch.address1,
        customerAddress2: branch.address2,
        customerCountry: branch.country.name,
        customerState: branch.state.name,
        customerCity: branch.city.name,
        customerDui: customer.dui,
        customerNit: customer.nit,
        customerNrc: customer.nrc,
        customerGiro: customer.giro,
        paymentConditionName: condition.name,
        sellerName: seller.name,
        zoneName: seller.invoicesZone.name,
        sum: header.sum,
        iva: header.iva,
        subtotal: header.subtotal,
        ivaRetenido: header.ivaRetenido,
        ventasExentas: header.ventasExentas,
        ventasNoSujetas: header.ventasNoSujetas,
        ventaTotal: header.ventaTotal,
        ventaTotalText: numeroALetras(header.ventaTotal),
      })
      .execute();
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message:
        "Error al registrar el encabezado de la venta, contacta con tu administrador.",
    });
  }

  try {
    await req.conn
      .createQueryBuilder()
      .insert()
      .into("InvoiceDetail")
      .values(
        details.map((d) => {
          return {
            ...d,
            invoice: invoice.raw[0].id,
            sellingType: services.find((s) => s.id == d.service).sellingType.id,
            chargeName: services.find((s) => s.id == d.service).name,
          };
        })
      )
      .execute();
  } catch (error) {
    return res.status(400).json({
      message:
        "Error al guardar los detalles de la venta, contacta con tu administrador.",
    });
  }

  // Actualiza el documento
  await req.conn
    .createQueryBuilder()
    .update("InvoicesDocument")
    .set({ current: sequence + 1 })
    .where("company = :company", { company: req.user.cid })
    .andWhere("isCurrentDocument = :current", { current: true })
    .andWhere("documentType = :type", { type: header.documentType })
    .execute();

  const user = await req.conn
    .getRepository("User")
    .createQueryBuilder("u")
    .where("u.id = :id", { id: req.user.uid })
    .getOne();

  await addLog(
    req.conn,
    req.moduleName,
    `${user.names} ${user.lastnames}`,
    user.id,
    `Se ha registrado la venta: ${document.authorization} - ${sequence}`
  );

  return res.json({
    message: `La venta ha sido registrada correctamente. ${message}`,
    id: invoice.raw[0].id,
  });
});

module.exports = router;
