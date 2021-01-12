const express = require("express");
const router = express.Router();
const { startOfMonth, endOfMonth } = require("date-fns");
const { checkRequired } = require("../../tools");

router.get("/", async (req, res) => {
  const check = checkRequired(req.query, [
    { name: "accountingEntryType", type: "string", optional: false },
    { name: "date", type: "date", optional: false },
  ]);
  if (!check.success) {
    return res.status(400).json({ message: check.message });
  }

  const { accountingEntryType, date } = req.query;

  try {
    const entries = await req.conn
      .getRepository("AccountingEntry")
      .createQueryBuilder("ae")
      .select(["ae.serie", "ae.date"])
      .leftJoin("ae.accountingEntryType", "aet")
      .where("ae.company = :company", { company: req.user.cid })
      .andWhere("aet.id = :accountingEntryType", { accountingEntryType })
      .andWhere("ae.date >= :startDate", {
        startDate: startOfMonth(new Date(date)),
      })
      .andWhere("ae.date <= :endDate", { endDate: endOfMonth(new Date(date)) })
      .getMany();

    const currentEntries = entries
      .map((e) => parseInt(e.serie))
      .sort((a, b) => {
        if (a < b) return 1;
        if (a > b) return -1;
        return 0;
      });
    return res.json({
      nextSerie: currentEntries.length > 0 ? currentEntries[0] + 1 : 1,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error al obtener el listado de tipos de partida." });
  }
});

module.exports = router;
