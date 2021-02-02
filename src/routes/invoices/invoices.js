const express = require("express");
const { format } = require("date-fns");
const {
  checkRequired,
  addLog,
  numeroALetras,
  foundRelations,
} = require("../../tools");
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
      { name: "service", type: "string", optional: true },
      { name: "prop", type: "string", optional: true },
      { name: "order", type: "string", optional: true },
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
      prop,
      order
    } = req.query;

    // Obtiene el total de facturas
    let query = req.conn
      .getRepository("Invoice")
      .createQueryBuilder("i")
      .select("COUNT(i.id)", "count")
      .leftJoin("i.documentType", "dt")
      .leftJoin("i.customer", "cu")
      .leftJoin("i.invoicesSeller", "sl")
      .leftJoin("i.invoicesZone", "zo")
      .leftJoin("i.status", "st")
      .leftJoin("i.details", "d")
      .leftJoin("d.service", "s")
      .where("i.company = :company", { company: cid });

    if (documentType) {
      query = query.andWhere("dt.id = :documentType", { documentType });
    }
    if (customer) {
      query = query.andWhere("cu.id = :customer", { customer });
    }
    if (seller) {
      query = query.andWhere("sl.id = :seller", { seller });
    }
    if (zone) {
      query = query.andWhere("zo.id = :zone", { zone });
    }
    if (status) {
      query = query.andWhere("st.id = :status", { status });
    }
    if (service) {
      query = query.andWhere("s.id = :service", { service });
    }
    if (startDate && endDate) {
      query = query.andWhere("i.invoiceDate >= :startDate", {
        startDate,
      });
      query = query.andWhere("i.invoiceDate <= :endDate", { endDate });
    }

    let { count } = await query.getRawOne();

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
        "st.id",
        "st.name",
        "dt.id",
        "dt.name",
        "dt.code",
      ])
      .leftJoin("i.documentType", "dt")
      .leftJoin("i.customer", "cu")
      .leftJoin("i.invoicesSeller", "sl")
      .leftJoin("i.invoicesZone", "zo")
      .leftJoin("i.status", "st")
      .leftJoin("i.details", "d")
      .leftJoin("d.service", "s")
      .where("i.company = :company", { company: cid });

    if (prop && order) {
      invoices = invoices.orderBy(`i.${prop}`, order == 'ascending' ? 'ASC' : "DESC")
    } else {
      invoices = invoices.orderBy("i.createdAt", "DESC")
    }

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
    if (service) {
      invoices = invoices.andWhere("s.id = :service", { service });
    }
    if (startDate && endDate) {
      invoices = invoices.andWhere("i.invoiceDate >= :startDate", {
        startDate,
      });
      invoices = invoices.andWhere("i.invoiceDate <= :endDate", { endDate });
    }
    invoices = await invoices.getMany();

    if (search != null) {
      invoices = invoices.filter(
        (s) =>
          s.authorization.toLowerCase().includes(search) ||
          s.sequence.toLowerCase().includes(search) ||
          format(new Date(s.invoiceDate), "dd/MM/yyyy")
            .toLowerCase()
            .includes(search) ||
          s.customerName.toLowerCase().includes(search) ||
          s.customerName.toLowerCase().includes(search) ||
          s.ventaTotal.toString().includes(search)
      );
      count = invoices.length;
    }

    return res.json({
      count,
      invoices: invoices.map((i) => {
        return {
          index: index++,
          ...i,
          invoiceRawDate: i.invoiceDate,
          invoiceDate: format(new Date(i.invoiceDate), "dd/MM/yyyy"),
        };
      }),
    });
  } catch (error) {
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
        "dt.code",
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
        invoiceRawDate: invoice.invoiceDate,
        invoiceDate: format(new Date(invoice.invoiceDate), "dd/MM/yyyy"),
        printedRawDate: invoice.printedDate,
        printedDate: invoice.printedDate
          ? format(new Date(invoice.printedDate), "dd/MM/yyyy")
          : null,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error al obtener La venta seleccionada." });
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
    .leftJoinAndSelect("c.customerType", "ct")
    .leftJoinAndSelect("c.customerTypeNatural", "ctn")
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
        company: req.user.cid,
        branch: req.user.bid,
        customer: header.customer,
        customerBranch: header.customerBranch,
        customerType: customer.customerType.id,
        customerTypeNatural: customer.customerTypeNatural
          ? customer.customerTypeNatural.id
          : null,
        documentType: header.documentType,
        invoicesPaymentsCondition: header.invoicesPaymentsCondition,
        invoicesSeller: header.invoicesSeller,
        invoicesZone: seller.invoicesZone.id,
        status: 1,
      })
      .execute();
  } catch (error) {
    return res.status(400).json({
      message:
        "Error al registrar el encabezado de La venta, contacta con tu administrador.",
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
        "Error al guardar los detalles de La venta, contacta con tu administrador.",
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
    `Se ha registrado La venta: ${document.authorization} - ${sequence}`
  );

  return res.json({
    message: `La venta ha sido registrada correctamente. ${message}`,
    id: invoice.raw[0].id,
  });
});

router.put("/:id", async (req, res) => {
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

  const invoice = await req.conn
    .getRepository("Invoice")
    .createQueryBuilder("i")
    .where("i.company = :company", { company: req.user.cid })
    .andWhere("i.id = :id", { id: req.params.id })
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

  const services = await req.conn
    .getRepository("Service")
    .createQueryBuilder("s")
    .select(["s.id", "s.name", "st.id"])
    .where("s.id IN (:...ids)", { ids: details.map((d) => d.service) })
    .leftJoin("s.sellingType", "st")
    .getMany();

  // Actualiza el invoice
  try {
    await req.conn
      .createQueryBuilder()
      .update("Invoice")
      .set({
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
      .where("id = :id", { id: req.params.id })
      .execute();
  } catch (error) {
    return res.status(400).json({
      message:
        "Error al actualilzar el encabezado de la venta, contacta con tu administrador.",
    });
  }

  // Actualiza los detalles
  try {
    // Elimina todos los detalles
    await req.conn
      .createQueryBuilder()
      .delete()
      .from("InvoiceDetail")
      .where("invoice = :invoice", { invoice: req.params.id })
      .execute();

    // Inserta todos los detalles nuevamente
    await req.conn
      .createQueryBuilder()
      .insert()
      .into("InvoiceDetail")
      .values(
        details.map((d) => {
          return {
            ...d,
            invoice: req.params.id,
            sellingType: services.find((s) => s.id == d.service).sellingType.id,
            chargeName: services.find((s) => s.id == d.service).name,
          };
        })
      )
      .execute();
  } catch (error) {
    return res.status(400).json({
      message:
        "Error al actualizar los detalles de la venta, contacta con tu administrador.",
    });
  }

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
    `Se ha registrado la venta: ${invoice.authorization} - ${invoice.sequence}`
  );

  return res.json({
    message: `La venta ha sido actualizada correctamente.`,
  });
});

router.delete("/:id", async (req, res) => {
  // Get the invoice
  const invoice = await req.conn
    .getRepository("Invoice")
    .createQueryBuilder("i")
    .leftJoinAndSelect("i.documentType", "dt")
    .leftJoinAndSelect("i.status", "st")
    .where("i.company = :company", { company: req.user.cid })
    .andWhere("i.id = :id", { id: req.params.id })
    .getOne();

  // If no customer exist
  if (!invoice) {
    return res.status(400).json({ message: "La venta ingresada no existe." });
  }

  // If customer exist
  // Check references in other tables than details
  const references = await foundRelations(req.conn, "invoice", invoice.id, [
    "invoice_detail",
  ]);

  // if references rejects deletion
  if (references) {
    return res.status(400).json({
      message:
        "La venta seleccionada no puede ser eliminada porque esta siendo utilizada en el sistema.",
    });
  }

  // check if any allowed status to delete
  const allowedStatuses = [1];
  let statuses = await req.conn
    .getRepository("InvoicesStatus")
    .createQueryBuilder("st")
    .getMany();

  if (!allowedStatuses.includes(invoice.status.id)) {
    const status = statuses.find((s) => s.id == invoice.status.id);
    return res.status(400).json({
      message: `La venta seleccionada no puede ser eliminada mientras tenga estado "${status.name.toUpperCase()}"`,
    });
  }

  // Check if last invoice number
  const document = await req.conn
    .getRepository("InvoicesDocument")
    .createQueryBuilder("id")
    .where("id.documentType = :documentType", {
      documentType: invoice.documentType.id,
    })
    .andWhere("id.company = :company", { company: req.user.cid })
    .getOne();

  if (document.current - 1 != invoice.sequence) {
    return res.status(400).json({
      message:
        "La venta seleccionada no puede ser eliminada, solo puede ser anulada ya que no es el ultimo correlativo ingresado.",
    });
  }

  try {
    // Delete invoice details
    await req.conn
      .createQueryBuilder()
      .delete()
      .from("InvoiceDetail")
      .where("invoice = :invoice", { invoice: req.params.id })
      .execute();

    // Delete invoices
    await req.conn
      .createQueryBuilder()
      .delete()
      .from("Invoice")
      .where("id = :id", { id: req.params.id })
      .andWhere("company = :company", { company: req.user.cid })
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
      `Se elimino la venta con referencia: ${invoice.authorization} - ${invoice.sequence}.`
    );

    return res.json({
      message: "La venta ha sido eliminada correctamente.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al eliminar la venta. Conctacta a tu administrador.",
    });
  }
});

module.exports = router;
