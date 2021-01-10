const express = require("express");
const { format, startOfMonth, endOfMonth } = require("date-fns");
const { checkRequired, addLog } = require("../../tools");
const router = express.Router();

router.get("/", async (req, res) => {
  const check = checkRequired(
    req.query,
    [
      { name: "limit", type: "integer", optional: true },
      { name: "page", type: "integer", optional: true },
      { name: "search", type: "string", optional: true },
      { name: "squared", type: "boolean", optional: true },
      { name: "accounted", type: "boolean", optional: true },
      { name: "startDate", type: "date", optional: true },
      { name: "endDate", type: "date", optional: true },
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
      squared,
      accounted,
      startDate,
      endDate,
    } = req.query;

    let query = req.conn
      .getRepository("AccountingEntry")
      .createQueryBuilder("ae")
      .select("COUNT(ae.id)", "count")
      .leftJoin("ae.accountingEntryType", "aet")
      .where("ae.company = :company", { company: cid });

    if (squared == "true") {
      query = query.andWhere("ae.squared = :squared", {
        squared: squared == "true",
      });
    }
    if (accounted == "true") {
      query = query.andWhere("ae.accounted = :accounted", {
        accounted: accounted == "true",
      });
    }
    if (startDate && endDate) {
      query = query.andWhere("ae.date >= :startDate", {
        startDate,
      });
      query = query.andWhere("ae.date <= :endDate", { endDate });
    }

    let { count } = await query.getRawOne();

    let entries = req.conn
      .getRepository("AccountingEntry")
      .createQueryBuilder("ae")
      .select([
        "ae.id",
        "ae.serie",
        "ae.title",
        "ae.date",
        "aet.id",
        "aet.name",
        "aet.code",
        // "aed.cargo",
      ])
      .leftJoin("ae.accountingEntryType", "aet")
      // .leftJoin("ae.accountingEntryDetails", "aed")
      .where("ae.company = :company", { company: cid })
      .orderBy("ae.createdAt", "DESC");

    let index = 1;
    if (search == null) {
      entries = entries
        .limit(limit)
        .offset(limit ? parseInt(page ? page - 1 : 0) * parseInt(limit) : null);
      index = index * page ? (page - 1) * limit + 1 : 1;
    }

    if (squared == "true") {
      entries = entries.andWhere("ae.squared = :squared", {
        squared: squared == "true",
      });
    }
    if (accounted == "true") {
      entries = entries.andWhere("ae.accounted = :accounted", {
        accounted: accounted == "true",
      });
    }
    if (startDate && endDate) {
      entries = entries.andWhere("ae.date >= :startDate", {
        startDate,
      });
      entries = entries.andWhere("ae.date <= :endDate", { endDate });
    }

    entries = await entries.getMany();

    if (search) {
      entries = entries.filter(
        (e) =>
          e.title.toLowerCase().includes(search) ||
          format(new Date(e.date), "dd/MM/yyyy").toLowerCase().includes(search)
      );
      count = entries.length;
    }

    for (const entry of entries) {
      const details = await req.conn
        .getRepository("AccountingEntryDetail")
        .createQueryBuilder("d")
        .leftJoinAndSelect("d.accountingEntry", "e")
        .where("e.id = :entry", { entry: entry.id })
        .getMany();
      entry.cargo = details.reduce((a, b) => a + b.cargo, 0);
    }

    return res.json({
      count,
      entries: entries.map((e) => {
        return {
          index: index++,
          ...e,
          rawDate: e.date,
          date: format(new Date(e.date), "dd/MM/yyyy"),
        };
      }),
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error al obtener el listado de partidas contables." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const entry = await req.conn
      .getRepository("AccountingEntry")
      .createQueryBuilder("ae")
      .select([
        "ae.id",
        "ae.serie",
        "ae.title",
        "ae.date",
        "ae.squared",
        "ae.accounted",
        "aet.id",
        "aet.name",
        "aet.code",
        "aed.id",
        "aed.catalogName",
        "aed.concept",
        "aed.cargo",
        "aed.abono",
        "ac.id",
        "ac.code",
        "ac.name",
      ])
      .where("ae.company = :company", { company: req.user.cid })
      .andWhere("ae.id = :id", { id: req.params.id })
      .leftJoin("ae.accountingEntryType", "aet")
      .leftJoin("ae.accountingEntryDetails", "aed")
      .leftJoin("aed.accountingCatalog", "ac")
      .getOne();

    if (!entry) {
      return res
        .status(400)
        .json({ message: "La partida contable seleccionada no existe." });
    }

    return res.json({
      entry: {
        ...entry,
        rawDate: entry.date,
        date: format(new Date(entry.date), "dd/MM/yyyy"),
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener la partida contable seleccionada." });
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
    { name: "accountingEntryType", type: "string", optional: false },
    { name: "title", type: "string", optional: false },
    { name: "serie", type: "integer", optional: false },
    { name: "date", type: "datae", optional: false },
    { name: "squared", type: "boolea", optional: false },
    { name: "accounted", type: "boolean", optional: false },
  ]);
  if (!checkHeader.success) {
    return res.status(400).json({ message: checkHeader.message });
  }
  // valida el objeto details
  for (const details of req.body.details) {
    const checkDetails = checkRequired(details, [
      { name: "accountingCatalog", type: "string", optional: false },
      { name: "concept", type: "string", optional: false },
      { name: "cargo", type: "float", optional: true },
      { name: "abono", type: "float", optional: true },
    ]);
    if (!checkDetails.success) {
      return res.status(400).json({ message: checkDetails.message });
    }
  }

  const { header, details } = req.body;

  // Get the highest serie
  // const { currentSerie } = await req.conn
  //   .getRepository("AccountingEntry")
  //   .createQueryBuilder("ae")
  //   .select("MAX(ae.serie)", "currentSerie")
  //   .where("ae.company = :company", { company: req.user.cid })
  //   .andWhere("ae.date >= :startDate", {
  //     startDate: startOfMonth(new Date(header.date)),
  //   })
  //   .andWhere("ae.date <= :endDate", {
  //     endDate: endOfMonth(new Date(header.date)),
  //   })
  //   .getRawOne();

  const entries = await req.conn
    .getRepository("AccountingEntry")
    .createQueryBuilder("ae")
    .select("ae.serie")
    .where("ae.company = :company", { company: req.user.cid })
    .andWhere("ae.date >= :startDate", {
      startDate: startOfMonth(new Date(header.date)),
    })
    .andWhere("ae.date <= :endDate", {
      endDate: endOfMonth(new Date(header.date)),
    })
    .getMany();

  const currentSerie = entries
    .map((e) => parseInt(e.serie))
    .sort((a, b) => {
      if (a < b) return 1;
      if (a > b) return -1;
      return 0;
    })[0];

  let message = "";
  const serie = parseInt(currentSerie) + 1;
  if (header.serie != serie) {
    message = `El numero de serie asignado fué: ${serie}`;
  }

  // inserta el encabezado de partida
  let entry = null;
  try {
    entry = await req.conn
      .createQueryBuilder()
      .insert()
      .into("AccountingEntry")
      .values({
        serie,
        title: header.title,
        date: header.date,
        squared: header.squared,
        accounted: header.accounted,
        accountingEntryType: header.accountingEntryType,
        company: req.user.cid,
      })
      .execute();
  } catch (error) {
    return res.status(400).json({
      message:
        "Error al registrar el encabezado de la partida contable, contacta con tu administrador.",
    });
  }

  try {
    const catalog = await req.conn
      .getRepository("AccountingCatalog")
      .createQueryBuilder("c")
      .where("c.company = :company", { company: req.user.cid })
      .getMany();

    // inserta los detalles de partida
    await req.conn
      .createQueryBuilder()
      .insert()
      .into("AccountingEntryDetail")
      .values(
        details.map((d) => {
          return {
            ...d,
            accountingEntry: entry.raw[0].id,
            catalogName: catalog.find((c) => c.id == d.accountingCatalog).name,
            company: req.user.cid,
          };
        })
      )
      .execute();
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message:
        "Error al guardar los detalles de la partida contable, contacta con tu administrador.",
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
    `Se ha registrado la partida contable: ${header.title}`
  );

  return res.json({
    message: `La partida contable ha sido registrada correctamente. ${message}`,
    id: entry.raw[0].id,
  });
});

// router.put("/:id", async (req, res) => {
//   // valida los objetos header y details
//   const check = checkRequired(req.body, [
//     { name: "header", type: "object", optional: false },
//     { name: "details", type: "array", optional: false },
//   ]);
//   if (!check.success) {
//     return res.status(400).json({ message: check.message });
//   }

//   // valida el objeto header
//   const checkHeader = checkRequired(req.body.header, [
//     { name: "customer", optional: false },
//     { name: "customerBranch", optional: false },
//     { name: "invoicesSeller", optional: false },
//     { name: "invoicesPaymentsCondition", optional: false },
//     { name: "invoiceDate", type: "date", optional: false },
//     { name: "sum", type: "float", optional: false },
//     { name: "iva", type: "float", optional: false },
//     { name: "subtotal", type: "float", optional: false },
//     { name: "ivaRetenido", type: "float", optional: false },
//     { name: "ventasExentas", type: "float", optional: false },
//     { name: "ventasNoSujetas", type: "float", optional: false },
//     { name: "ventaTotal", type: "float", optional: false },
//   ]);
//   if (!checkHeader.success) {
//     return res.status(400).json({ message: checkHeader.message });
//   }
//   // valida el objeto details
//   for (const details of req.body.details) {
//     const checkDetails = checkRequired(details, [
//       { name: "service", optional: false },
//       { name: "chargeDescription", optional: false },
//       { name: "quantity", type: "float", optional: false },
//       { name: "unitPrice", type: "float", optional: false },
//       { name: "incTax", type: "boolean", optional: false },
//       { name: "ventaPrice", type: "float", optional: false },
//     ]);
//     if (!checkDetails.success) {
//       return res.status(400).json({ message: checkDetails.message });
//     }
//   }

//   const { header, details } = req.body;

//   const invoice = await req.conn
//     .getRepository("Invoice")
//     .createQueryBuilder("i")
//     .where("i.company = :company", { company: req.user.cid })
//     .andWhere("i.id = :id", { id: req.params.id })
//     .getOne();

//   const customer = await req.conn
//     .getRepository("Customer")
//     .createQueryBuilder("c")
//     .where("c.company = :company", { company: req.user.cid })
//     .andWhere("c.id = :id", { id: header.customer })
//     .getOne();

//   const branch = await req.conn
//     .getRepository("CustomerBranch")
//     .createQueryBuilder("cb")
//     .where("cb.customer = :customer", { customer: header.customer })
//     .andWhere("cb.id = :id", { id: header.customerBranch })
//     .leftJoinAndSelect("cb.country", "co")
//     .leftJoinAndSelect("cb.state", "st")
//     .leftJoinAndSelect("cb.city", "ci")
//     .getOne();

//   const condition = await req.conn
//     .getRepository("InvoicesPaymentsCondition")
//     .createQueryBuilder("pc")
//     .where("pc.company = :company", { company: req.user.cid })
//     .andWhere("pc.id = :id", { id: header.invoicesPaymentsCondition })
//     .getOne();

//   const seller = await req.conn
//     .getRepository("InvoicesSeller")
//     .createQueryBuilder("is")
//     .where("is.company = :company", { company: req.user.cid })
//     .andWhere("is.id = :id", { id: header.invoicesSeller })
//     .leftJoinAndSelect("is.invoicesZone", "iz")
//     .getOne();

//   const services = await req.conn
//     .getRepository("Service")
//     .createQueryBuilder("s")
//     .select(["s.id", "s.name", "st.id"])
//     .where("s.id IN (:...ids)", { ids: details.map((d) => d.service) })
//     .leftJoin("s.sellingType", "st")
//     .getMany();

//   // Actualiza el invoice
//   try {
//     await req.conn
//       .createQueryBuilder()
//       .update("Invoice")
//       .set({
//         invoiceDate: header.invoiceDate,
//         customerName: customer.name,
//         customerAddress1: branch.address1,
//         customerAddress2: branch.address2,
//         customerCountry: branch.country.name,
//         customerState: branch.state.name,
//         customerCity: branch.city.name,
//         customerDui: customer.dui,
//         customerNit: customer.nit,
//         customerNrc: customer.nrc,
//         customerGiro: customer.giro,
//         paymentConditionName: condition.name,
//         sellerName: seller.name,
//         zoneName: seller.invoicesZone.name,
//         sum: header.sum,
//         iva: header.iva,
//         subtotal: header.subtotal,
//         ivaRetenido: header.ivaRetenido,
//         ventasExentas: header.ventasExentas,
//         ventasNoSujetas: header.ventasNoSujetas,
//         ventaTotal: header.ventaTotal,
//         ventaTotalText: numeroALetras(header.ventaTotal),
//       })
//       .where("id = :id", { id: req.params.id })
//       .execute();
//   } catch (error) {
//     return res.status(400).json({
//       message:
//         "Error al actualilzar el encabezado de la venta, contacta con tu administrador.",
//     });
//   }

//   // Actualiza los detalles
//   try {
//     // Elimina todos los detalles
//     await req.conn
//       .createQueryBuilder()
//       .delete()
//       .from("InvoiceDetail")
//       .where("invoice = :invoice", { invoice: req.params.id })
//       .execute();

//     // Inserta todos los detalles nuevamente
//     await req.conn
//       .createQueryBuilder()
//       .insert()
//       .into("InvoiceDetail")
//       .values(
//         details.map((d) => {
//           return {
//             ...d,
//             invoice: req.params.id,
//             sellingType: services.find((s) => s.id == d.service).sellingType.id,
//             chargeName: services.find((s) => s.id == d.service).name,
//           };
//         })
//       )
//       .execute();
//   } catch (error) {
//     return res.status(400).json({
//       message:
//         "Error al actualizar los detalles de la venta, contacta con tu administrador.",
//     });
//   }

//   const user = await req.conn
//     .getRepository("User")
//     .createQueryBuilder("u")
//     .where("u.id = :id", { id: req.user.uid })
//     .getOne();

//   await addLog(
//     req.conn,
//     req.moduleName,
//     `${user.names} ${user.lastnames}`,
//     user.id,
//     `Se ha registrado la venta: ${invoice.authorization} - ${invoice.sequence}`
//   );

//   return res.json({
//     message: `La venta ha sido actualizada correctamente.`,
//   });
// });

module.exports = router;