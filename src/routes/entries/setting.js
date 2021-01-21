const express = require("express");
const { checkRequired } = require("../../tools");
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
  const check = checkRequired(req.body, [
    { name: "settings", type: "array", optional: false },
  ]);
  if (!check.success) {
    return res.status(400).json({ message: check.message });
  }

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

router.get("/estado-resultados", async (req, res) => {
  try {
    const { settings } = await req.conn
      .getRepository("AccountingSetting")
      .createQueryBuilder("as")
      .where("as.company = :company", { company: req.user.cid })
      .andWhere("as.type = :type", { type: 'estado-resultados' })
      .getOne();

    return res.json({ estadoResultados: settings });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener la configuracion del estado de resultados." });
  }
});

router.put('estado-resultados', async (req, res) => {
  const check = checkRequired(req.body, [
    { name: "settings", type: "array", optional: false },
  ]);
  if (!check.success) {
    return res.status(400).json({ message: check.message });
  }

  try {
    const { settings } = req.body;
    await req.conn
      .createQueryBuilder()
      .update("AccountingSetting")
      .set({ settings })
      .where("company = :company", { company: req.user.cid })
      .andWhere("type = :type", { type: 'estado-resultados' })
      .execute();

    return res
      .json({ message: "Configuracion de estado de resultados actualizada correctamente." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al actualizar la configuracion de estado de resultados." });
  }
});

module.exports = router;
