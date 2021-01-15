const express = require("express");
const { checkRequired } = require("../../tools");
const { startOfMonth, endOfMonth, format } = require("date-fns");
const router = express.Router();

router.get("/diario-mayor", async (req, res) => {
  const check = checkRequired(req.query, [
    { name: "date", type: "date", optional: false },
  ]);
  if (!check.success) {
    return res.status(400).json({ message: check.message });
  }

  try {
    const date = new Date(req.query.date);

    const catalog = await req.conn
      .getRepository("AccountingCatalog")
      .createQueryBuilder("d")
      .where("d.company = :company", { company: req.user.cid })
      .getMany();

    // obtiene los detalles de la partida del rango seleccionado
    const rangeDetails = await req.conn
      .getRepository("AccountingEntryDetail")
      .createQueryBuilder("d")
      .where("d.company = :company", { company: req.user.cid })
      .andWhere("e.date >= :startDate", { startDate: startOfMonth(date) })
      .andWhere("e.date <= :endDate", { endDate: endOfMonth(date) })
      .leftJoinAndSelect("d.accountingEntry", "e")
      .leftJoinAndSelect("d.accountingCatalog", "c")
      .getMany();

    // obtiene los detalles de la partida anteriores al rango seleccionado
    const previousDetails = await req.conn
      .getRepository("AccountingEntryDetail")
      .createQueryBuilder("d")
      .where("d.company = :company", { company: req.user.cid })
      .andWhere("e.date < :date", { date: startOfMonth(date) })
      .leftJoinAndSelect("d.accountingEntry", "e")
      .leftJoinAndSelect("d.accountingCatalog", "c")
      .getMany();

    // define el listado de cuentas contables afectadas en el periodo seleccionado
    const affectedCatalog = [
      ...new Set(rangeDetails.map((d) => d.accountingCatalog.code)),
    ];

    let accounts = [];
    // obtiene el saldo inicial por cuenta
    accounts = affectedCatalog
      .map((c) => {
        const account = catalog.find((ct) => ct.code == c);
        const abono = previousDetails
          .filter((d) => d.accountingCatalog.code == c)
          .reduce((a, b) => a + (b.abono ? b.abono : 0), 0);
        const cargo = previousDetails
          .filter((d) => d.accountingCatalog.code == c)
          .reduce((a, b) => a + (b.cargo ? b.cargo : 0), 0);
        const applicable = rangeDetails.filter(
          (d) => d.accountingCatalog.code == c
        );
        const movements = [];
        for (let item of applicable) {
          const found = movements.find(
            (m) => m.date == item.accountingEntry.date
          );
          if (found) {
            found.cargo = found.cargo + (item.cargo ? item.cargo : 0);
            found.abono = found.abono + (item.abono ? item.abono : 0);
          } else {
            movements.push({
              date: item.accountingEntry.date,
              cargo: item.cargo ? item.cargo : 0,
              abono: item.abono ? item.abono : 0,
              balance: 0,
            });
          }
        }
        const initialBalance = account.isAcreedora
          ? abono - cargo
          : cargo - abono;
        let currentBalance = initialBalance;
        return {
          code: c,
          name: account.name,
          initialBalance: parseFloat(initialBalance.toFixed(2)),
          movements: movements
            .sort((a, b) => {
              if (new Date(a.date) > new Date(b.date)) return 1;
              if (new Date(a.date) < new Date(b.date)) return -1;
              return 0;
            })
            .map((m) => {
              currentBalance = parseFloat(
                (
                  currentBalance +
                  (account.isAcreedora ? m.abono - m.cargo : m.cargo - m.abono)
                ).toFixed(2)
              );
              return {
                ...m,
                date: format(new Date(m.date), "dd/MM/yyyy"),
                balance: currentBalance,
              };
            }),
          totalAbono: movements.reduce((a, b) => a + b.abono, 0),
          totalCargo: movements.reduce((a, b) => a + b.cargo, 0),
          currentBalance,
        };
      })
      .sort((a, b) => {
        if (a.code < b.code) return -1;
        if (a.code > b.code) return 1;
        return 0;
      });

    return res.json({ accounts });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error al obtener el listado de tipos de partida." });
  }
});

module.exports = router;
