const express = require("express");
const { checkRequired, addLog } = require("../../tools");
const router = express.Router();

router.get("/", async (req, res) => {
  const check = checkRequired(
    req.query,
    [{ name: "search", type: "string", optional: true }],
    true
  );
  if (!check.success) {
    return res.status(400).json({ message: check.message });
  }

  try {
    const { search } = req.query;

    let accountingCatalog = await req.conn
      .getRepository("AccountingCatalog")
      .createQueryBuilder("ac")
      .select([
        "ac.id",
        "ac.code",
        "ac.name",
        "ac.isAcreedora",
        "ac.isBalance",
        "ac.isParent",
        'sa.id',
        'pc.code',
        'pc.name'
      ])
      .where("ac.company = :company", { company: req.user.cid })
      .leftJoin('ac.subAccounts', 'sa')
      .leftJoin('ac.parentCatalog', 'pc')
      .orderBy("ac.code", "ASC")
      .getMany();

    if (search) {
      accountingCatalog = accountingCatalog.filter(
        (ac) =>
          ac.code.toLowerCase().includes(search) ||
          ac.name.toLowerCase().includes(search)
      );
    }

    return res.json({
      accountingCatalog: accountingCatalog.map(a => {
        return {
          ...a,
          subAccounts: a.subAccounts.length > 0
        }
      }),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener el listado de tipos de partida." });
  }
});

router.post("/", async (req, res) => {
  const check = checkRequired(req.body, [
    { name: "parentCatalog", type: "string", optional: true },
    { name: "accounts", type: "array", optional: false },
  ]);
  if (!check.success) {
    return res.status(400).json({ message: check.message });
  }

  for (const accounts of req.body.accounts) {
    const checkAccounts = checkRequired(accounts, [
      { name: "code", type: "string", optional: false },
      { name: "name", type: "string", optional: false },
      { name: "description", type: "string", optional: true },
      { name: "isAcreedora", type: "boolean", optional: false },
      { name: "isBalance", type: "boolean", optional: false },
    ]);
    if (!checkAccounts.success) {
      return res.status(400).json({ message: checkAccounts.message });
    }
  }

  const { parentCatalog, accounts } = req.body;

  // Si el campo parentCatalog viene se valida que exista
  if (parentCatalog) {
    const parent = await req.conn
      .getRepository("AccountingCatalog")
      .createQueryBuilder("ac")
      .where("ac.company = :company", { company: req.user.cid })
      .andWhere("ac.id = :id", { id: parentCatalog })
      .getOne();

    if (!parent) {
      return res.status(400).json({
        message: "La cuenta de catalogo padre seleccionada no existe.",
      });
    }
  }

  try {
    // Se isnerta la cuenta
    const account = await req.conn
      .createQueryBuilder()
      .insert()
      .into("AccountingCatalog")
      .values(
        accounts.map((a) => {
          return {
            ...a,
            parentCatalog,
            company: req.user.cid,
          };
        })
      )
      .execute();

    // Si viene definido parentCatalog se actualiza a padre
    if (parentCatalog) {
      await req.conn
        .createQueryBuilder()
        .update("AccountingCatalog")
        .set({ isParent: true })
        .where("company = :company", { company: req.user.cid })
        .andWhere("id = :parentCatalog", { parentCatalog })
        .execute();
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
      `Se ha creado la cuenta contable: ${accounts
        .map((a) => a.code)
        .join(", ")}`
    );

    // On success
    return res.json({
      message: "La(s) cuenta(s) contable(s) se ha creado correctamente.",
      id: account.raw.map((a) => a.id),
    });
  } catch (error) {
    // On errror
    console.log(error);
    return res.status(400).json({
      message:
        "Error al guardar la(s) cuenta(s) contable(s), contacta con tu administrador.",
    });
  }
});

module.exports = router;
