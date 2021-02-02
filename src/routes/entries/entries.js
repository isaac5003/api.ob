const express = require("express");
const { format, startOfMonth, endOfMonth } = require("date-fns");
const { checkRequired, addLog, foundRelations } = require("../../tools");
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
      { name: "entryType", type: "string", optional: true },
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
      squared,
      accounted,
      startDate,
      endDate,
      entryType,
      prop,
      order
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
    if (entryType) {
      query = query.andWhere("aet.id = :entryType", {
        entryType,
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
        "ae.squared",
        "ae.accounted",
        "aet.id",
        "aet.name",
        "aet.code",
      ])
      .leftJoin("ae.accountingEntryType", "aet")
      .where("ae.company = :company", { company: cid });

    if (order && prop) {
      entries = entries.orderBy(`ae.${prop}`, order == 'ascending' ? 'ASC' : "DESC")
    } else {
      entries = entries.orderBy("ae.createdAt", "DESC")
    }

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
    if (entryType) {
      entries = entries.andWhere("aet.id = :entryType", {
        entryType,
      });
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
    console.error(error);
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
  const serie = currentSerie ? parseInt(currentSerie) + 1 : 1;
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
    { name: "accountingEntryType", type: "string", optional: false },
    { name: "title", type: "string", optional: false },
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
  const { cid } = req.user;

  // actualiza el encabezado de partida
  try {
    await req.conn
      .createQueryBuilder()
      .update("AccountingEntry")
      .set({
        title: header.title,
        date: header.date,
        squared: header.squared,
        accounted: header.accounted,
        accountingEntryType: header.accountingEntryType,
      })
      .where("company = :company", { company: cid })
      .andWhere("id = :id", { id: req.params.id })
      .execute();
  } catch (error) {
    return res.status(400).json({
      message:
        "Error al actualizar el encabezado de la partida contable, contacta con tu administrador.",
    });
  }

  // Actualiza los detalles
  try {
    // Elimina todos los detalles
    await req.conn
      .createQueryBuilder()
      .delete()
      .from("AccountingEntryDetail")
      .where("company = :company", { company: cid })
      .andWhere("accountingEntry = :accountingEntry", {
        accountingEntry: req.params.id,
      })
      .execute();

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
            accountingEntry: req.params.id,
            catalogName: catalog.find((c) => c.id == d.accountingCatalog).name,
            company: req.user.cid,
          };
        })
      )
      .execute();
  } catch (error) {
    return res.status(400).json({
      message:
        "Error al actualizar los detalles de la partida contable, contacta con tu administrador.",
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
    `Se ha actualizado la partida contable: ${header.title}`
  );

  return res.json({
    message: `La partida contable ha sido actualizada correctamente.`,
  });
});

router.delete("/:id", async (req, res) => {
  // Get the entry
  const entry = await req.conn
    .getRepository("AccountingEntry")
    .createQueryBuilder("a")
    .where("a.company = :company", { company: req.user.cid })
    .andWhere("a.id = :id", { id: req.params.id })
    .getOne();

  // If no entry exist
  if (!entry) {
    return res.status(400).json({ message: "La partida contable ingresada no existe." });
  }

  // If entry exist
  // Check references in other tables than details
  const references = await foundRelations(req.conn, "accounting_entry", entry.id, [
    "accounting_entry_detail",
  ]);

  // if references rejects deletion
  if (references) {
    return res.status(400).json({
      message:
        "La partida contable seleccionada no puede ser eliminada porque esta siendo utilizada en el sistema.",
    });
  }

  try {
    // Delete entry details
    await req.conn
      .createQueryBuilder()
      .delete()
      .from("AccountingEntryDetail")
      .where("accountingEntry = :accountingEntry", { accountingEntry: req.params.id })
      .andWhere("company = :company", { company: req.user.cid })
      .execute();

    // Delete entry
    await req.conn
      .createQueryBuilder()
      .delete()
      .from("AccountingEntry")
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
      `Se elimino la partida contable con referencia: ${entry.serie}.`
    );

    return res.json({
      message: "La partida contable ha sido eliminada correctamente.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error al eliminar la partida contable. Conctacta a tu administrador.",
    });
  }
});

module.exports = router;
