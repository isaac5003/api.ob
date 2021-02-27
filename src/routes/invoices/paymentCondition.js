const express = require('express');
const { checkRequired, foundRelations, addLog } = require('../../tools');
const router = express.Router();

router.get('/', async (req, res) => {
  const check = checkRequired(
    req.query,
    [
      { name: 'limit', type: 'integer', optional: true },
      { name: 'page', type: 'integer', optional: true },
      { name: 'active', type: 'boolean', optional: true },
      { name: 'search', type: 'string', optional: true },
    ],
    true,
  );
  if (!check.success) {
    return res.status(400).json({ message: check.message });
  }

  try {
    const { cid } = req.user;
    const { limit, page, active, search } = req.query;

    let query = req.conn
      .getRepository('InvoicesPaymentsCondition')
      .createQueryBuilder('pc')
      .where('pc.company = :company', { company: cid })
      .select('COUNT(pc.id)', 'count');

    if (active != null) {
      query = query.andWhere('pc.active = :active', {
        active: active == 'true',
      });
    }

    let { count } = await query.getRawOne();

    let paymentConditions = req.conn
      .getRepository('InvoicesPaymentsCondition')
      .createQueryBuilder('pc')
      .select(['pc.id', 'pc.name', 'pc.active', 'pc.cashPayment'])
      .where('pc.company = :company', { company: cid })
      .orderBy('pc.createdAt', 'DESC');

    let index = 1;
    if (search == null) {
      paymentConditions = paymentConditions
        .limit(limit)
        .offset(limit ? parseInt(page ? page - 1 : 0) * parseInt(limit) : null);
      index = index * page ? (page - 1) * limit + 1 : 1;
    }

    if (active != null) {
      paymentConditions = paymentConditions.andWhere('s.active = :active', {
        active: active == 'true',
      });
    }
    paymentConditions = await paymentConditions.getMany();

    if (search != null) {
      paymentConditions = paymentConditions.filter(s => s.name.toLowerCase().includes(search));
      count = paymentConditions.length;
    }

    return res.json({
      count,
      paymentConditions: paymentConditions.map(s => {
        return { index: index++, ...s };
      }),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al obtener el listado de condiciones de pago.' });
  }
});

router.post('/', async (req, res) => {
  // Verifica los campos requeridos
  const check = checkRequired(req.body, [
    { name: 'name', type: 'boolean', optional: false },
    { name: 'cashPayment', type: 'boolean', optional: false },
  ]);
  if (!check.success) {
    return res.status(400).json({ message: check.message });
  }

  // Obtiene los campos requeridos
  const { name, cashPayment } = req.body;

  // Inserta la condicion de pago
  try {
    const paymentCondition = await req.conn
      .createQueryBuilder()
      .insert()
      .into('InvoicesPaymentsCondition')
      .values({
        name,
        cashPayment,
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
      `Se ha creado la condicion de pago: ${name}`,
    );

    // On success
    return res.json({
      message: 'La condicion de pago se ha creado correctamente.',
      id: paymentCondition.raw[0].id,
    });
  } catch (error) {
    // On errror
    return res.status(400).json({
      message: 'Error al guardar la nueva condicion de pago, contacta con tu administrador.',
    });
  }
});

router.put('/:id', async (req, res) => {
  // Verifica los campos requeridos
  const check = checkRequired(req.body, [
    { name: 'name', type: 'boolean', optional: false },
    { name: 'cashPayment', type: 'boolean', optional: false },
  ]);
  if (!check.success) {
    return res.status(400).json({ message: check.message });
  }

  // Obtiene los campos requeridos
  const { name, cashPayment } = req.body;

  // Actualiza la condicion de pago
  try {
    await req.conn
      .createQueryBuilder()
      .update('InvoicesPaymentsCondition')
      .set({ name, cashPayment })
      .where('id = :id', { id: req.params.id })
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
      `Se ha editado la condicion de pago: ${name}`,
    );

    // On success
    return res.json({
      message: 'La condicion de pago ha sido actualizada correctamente.',
    });
  } catch (error) {
    // On errror
    return res.status(400).json({
      message: 'Error al actualizar la condicion de pago, contacta con tu administrador.',
    });
  }
});

router.put('/status/:id', async (req, res) => {
  // Check required field
  const check = checkRequired(req.body, ['status']);
  if (!check.success) {
    return res.status(400).json({ message: check.message });
  }

  // Get field
  const { status } = req.body;

  // Get paymentCondition
  const paymentCondition = await req.conn
    .getRepository('InvoicesPaymentsCondition')
    .createQueryBuilder('pc')
    .where('pc.company = :company', { company: req.user.cid })
    .andWhere('pc.id = :id', { id: req.params.id })
    .getOne();

  // If no exist
  if (!paymentCondition) {
    return res.status(400).json({ message: 'La condicion de pago seleccionada no existe.' });
  }

  // If paymentCondition exist updates it
  try {
    // return success
    await req.conn
      .createQueryBuilder()
      .update('InvoicesPaymentsCondition')
      .set({ active: status })
      .where('company = :company', { company: req.user.cid })
      .where('id = :id', { id: req.params.id })
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
      `Se cambio el estado de la condicion de pago: ${paymentCondition.name} a ${status ? 'ACTIVO' : 'INACTIVO'}.`,
    );

    return res.json({
      message: 'La condicion de pago ha sido actualizada correctamente.',
    });
  } catch (error) {
    // return error
    return res.status(500).json({
      message: 'Error al actualizar la condicion de pago. Contacta con tu administrador.',
    });
  }
});

router.delete('/:id', async (req, res) => {
  // Get the paymentCondition
  const paymentCondition = await req.conn
    .getRepository('InvoicesPaymentsCondition')
    .createQueryBuilder('pc')
    .where('pc.company = :company', { company: req.user.cid })
    .andWhere('pc.id = :id', { id: req.params.id })
    .getOne();

  // If no paymentCondition exist
  if (!paymentCondition) {
    return res.status(400).json({ message: 'La condicion de pago ingresada no existe' });
  }

  // If paymentCondition exist
  // Check references in other tables
  // const references = await foundRelations(
  //   req.conn,
  //   "invoices_seller",
  //   paymentCondition.id,
  //   [],
  //   "invoicesSeller"
  // );

  // if references rejects deletion
  // if (references) {
  //   return res.status(400).json({
  //     message:
  //       "El vendedor no puede ser eliminado porque esta siendo utilizado en el sistema.",
  //   });
  // }

  // If no references deletes
  try {
    await req.conn
      .createQueryBuilder()
      .delete()
      .from('InvoicesPaymentsCondition')
      .where('id = :id', { id: req.params.id })
      .andWhere('company = :company', { company: req.user.cid })
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
      `Se elimino la condicion de pago con nombre: ${paymentCondition.name}.`,
    );

    return res.json({
      message: 'La condicion de pago ha sido eliminada correctamente.',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al eliminar la condicion de pago. Conctacta a tu administrador.',
    });
  }
});

module.exports = router;
