const express = require("express");
const { checkRequired, addLog } = require("../../tools");
const router = express.Router();

router.put("/:id", async (req, res) => {
  // Check required field
  const check = checkRequired(req.body, ["status"]);
  if (!check.success) {
    return res.status(400).json({ message: check.message });
  }

  // Get field
  const { status } = req.body;

  // Get service
  const service = await req.conn
    .getRepository("Service")
    .createQueryBuilder("s")
    .where("s.company = :company", { company: req.user.cid })
    .andWhere("s.id = :id", { id: req.params.id })
    .getOne();

  // If no exist
  if (!service) {
    return res
      .status(400)
      .json({ message: "El servicio seleccionada no existe." });
  }

  // If service exist updates it
  try {
    // return success
    await req.conn
      .createQueryBuilder()
      .update("Service")
      .set({ active: status })
      .where("company = :company", { company: req.user.cid })
      .where("id = :id", { id: req.params.id })
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
      `Se cambio el estado del servicio: ${service.name} a ${
        status ? "ACTIVO" : "INACTIVO"
      }.`
    );

    return res.json({
      message: "El servicio ha sido actualizado correctamente.",
    });
  } catch (error) {
    // return error
    return res.status(500).json({
      message:
        "Error al actualizar el servicio. Contacta con tu administrador.",
    });
  }
});

module.exports = router;
