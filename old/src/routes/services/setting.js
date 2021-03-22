const express = require('express');
const { checkRequired, addLog } = require('../../tools');
const router = express.Router();

router.put('/integrations', async (req, res) => {
  // Check required field
  const check = checkRequired(req.body, [{ name: 'accountingCatalog', type: 'uuid', optional: false }]);
  if (!check.success) {
    return res.status(400).json({ message: check.message });
  }

  // Get field
  const { accountingCatalog } = req.body;

  // Get account
  const account = await req.conn
    .getRepository('AccountingCatalog')
    .createQueryBuilder('ac')
    .where('ac.company = :company', { company: req.user.cid })
    .andWhere('ac.id  = :id', { id: accountingCatalog })
    .getOne();

  // If no exist
  if (!account) {
    return res.status(400).json({ message: 'La cuenta selecciona no existe.' });
  }

  // If account exist updates the intergations
  //validate that account can be use
  if (account.isParent) {
    return res.status(400).json({ message: 'La cuenta selecciona no puede ser utilizada ya que no es asignable' });
  }

  try {
    const integrations = await req.conn
      .getRepository('ServiceSetting')
      .createQueryBuilder('c')
      .select(['c.id', 'ac.id'])
      .where('c.company = :company', { company: req.user.cid })
      .leftJoin('c.accountingCatalog', 'ac')
      .getOne();
    if (integrations) {
      // return success
      await req.conn
        .createQueryBuilder()
        .update('ServiceSetting')
        .set({ accountingCatalog: account.id })
        .where('company =:id', { id: req.user.cid })
        .execute();

      const user = await req.conn
        .getRepository('User')
        .createQueryBuilder('u')
        .where('u.id = :id', { id: req.user.uid })
        .getOne();

      await addLog(
        req.conn,
        req.moduleName,
        `${user.names} ${user.lastnames}`,
        user.id,
        `Se actualizo la configuracion de integracion.`,
      );

      return res.json({
        message: 'La configuracion de integración ha sido actualizada correctamente.',
      });
    }
    await req.conn
      .createQueryBuilder()
      .insert()
      .into('ServiceSetting')
      .values({
        accountingCatalog: account.id,
        company: req.user.cid,
      })
      .execute();

    const user = await req.conn
      .getRepository('User')
      .createQueryBuilder('u')
      .where('u.id = :id', { id: req.user.uid })
      .getOne();

    await addLog(
      req.conn,
      req.moduleName,
      `${user.names} ${user.lastnames}`,
      user.id,
      `Se agregó la cuenta contable de la integración`,
    );

    return res.json({
      message: 'La configuración de integración ha sido agregada correctamente.',
    });
  } catch (error) {
    // return error
    console.error(error);
    return res.status(500).json({
      message: 'Error al actualizar la configuracion de integración. Contacta con tu administrador.',
    });
  }
});
router.get('/integrations', async (req, res) => {
  try {
    const integrations = await req.conn
      .getRepository('ServiceSetting')
      .createQueryBuilder('c')
      .select(['c.id', 'ac.id'])
      .where('c.company = :company', { company: req.user.cid })
      .leftJoin('c.accountingCatalog', 'ac')
      .getOne();

    return res.json({
      integrations: { catalog: integrations.accountingCatalog ? integrations.accountingCatalog.id : null },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener las configuraciones de integración.' });
  }
});

module.exports = router;
