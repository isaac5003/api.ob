const express = require("express");
const { checkRequired, addLog } = require("../../tools");
const router = express.Router();

router.get("/balance-general", async (req, res) => {
  try {
    const { settings } = await req.conn
      .getRepository("AccountingSetting")
      .createQueryBuilder("as")
      .where("as.company = :company", { company: req.user.cid })
      .andWhere("as.type = :type", { type: 'balance-general' })
      .getOne();

    return res.json({ balanceGeneral: settings });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener la configuracion de balance general." });
  }
});

router.put('balance-general', async (req, res) => {
  try {
    const { settings } = req.body;
    await req.conn
      .createQueryBuilder()
      .update("AccountingSetting")
      .set({ settings })
      .where("company = :company", { company: req.user.cid })
      .andWhere("type = :type", { type: 'balance-general' })
      .execute();

    return res
      .json({ message: "Configuracion de balance general actualizada correctamente." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al actualizar la configuracion de balance general." });
  }
});

module.exports = router;
