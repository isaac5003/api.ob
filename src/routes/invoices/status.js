const express = require('express');
const { checkRequired, addLog } = require('../../tools');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const statuses = await req.conn
      .getRepository('InvoicesStatus')
      .createQueryBuilder('is')
      .select(['is.id', 'is.name'])
      .getMany();

    return res.json({ statuses });
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener el listado de los documentos.' });
  }
});

router.put('/void/:id', async (req, res) => {
  // Obtiene la venta por su id
  const invoice = await req.conn
    .getRepository('Invoice')
    .createQueryBuilder('i')
    .where('i.company = :company', { company: req.user.cid })
    .andWhere('i.id = :id', { id: req.params.id })
    .leftJoinAndSelect('i.status', 's')
    .getOne();

  // Si el invoice no exite
  if (!invoice) {
    return res.status(500).json({ message: 'El documento seleccionado no existe.' });
  }

  // Verifica que tenga uno de los estados que pueden anularse
  const statuses = [1, 2];
  if (!statuses.includes(invoice.status.id)) {
    return res.status(500).json({
      message: 'El documento no puede ser anulado porque tiene un estado que no lo permite.',
    });
  }

  // Cambia el estado a anulado
  try {
    await req.conn
      .createQueryBuilder()
      .update('Invoice')
      .set({ status: 3 })
      .where('company = :company', { company: req.user.cid })
      .where('id = :id', { id: req.params.id })
      .execute();

    const user = await req.conn
      .getRepository('User')
      .createQueryBuilder('u')
      .where('u.id = :id', { id: req.user.uid })
      .getOne();

    const status = await req.conn
      .getRepository('InvoicesStatus')
      .createQueryBuilder('i')
      .where('i.id = :id', { id: 3 })
      .getOne();

    await addLog(
      req.conn,
      req.moduleName,
      `${user.names} ${user.lastnames}`,
      user.id,
      `Se cambio el estado del documento: ${invoice.status.name} a ${status.name}.`,
    );

    return res.json({
      message: 'El documento ha sido anulado correctamente.',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Error al anular el documento. Contacta con tu administrador.',
    });
  }
});

router.put('/reverse/:id', async (req, res) => {
  // Obtiene la venta por su id
  const invoice = await req.conn
    .getRepository('Invoice')
    .createQueryBuilder('i')
    .where('i.company = :company', { company: req.user.cid })
    .andWhere('i.id = :id', { id: req.params.id })
    .leftJoinAndSelect('i.status', 's')
    .getOne();

  // Si el invoice no exite
  if (!invoice) {
    return res.status(500).json({ message: 'El documento seleccionado no existe.' });
  }

  // Verifica que tenga uno de los estados que pueden revertirse
  const statuses = [2, 3, 5];
  if (!statuses.includes(invoice.status.id)) {
    return res.status(500).json({
      message: 'El documento no puede revertirse porque tiene un estado que no lo permite.',
    });
  }

  // revierte el estado
  try {
    let newStatus = null;
    switch (invoice.status.id) {
      case 2:
        newStatus = 1;
        break;
      case 3:
        newStatus = 2;
        break;
      case 5:
        newStatus = 2;
        break;
    }

    await req.conn
      .createQueryBuilder()
      .update('Invoice')
      .set({ status: newStatus })
      .where('company = :company', { company: req.user.cid })
      .where('id = :id', { id: req.params.id })
      .execute();

    const user = await req.conn
      .getRepository('User')
      .createQueryBuilder('u')
      .where('u.id = :id', { id: req.user.uid })
      .getOne();

    const status = await req.conn
      .getRepository('InvoicesStatus')
      .createQueryBuilder('i')
      .where('i.id = :id', { id: newStatus })
      .getOne();

    await addLog(
      req.conn,
      req.moduleName,
      `${user.names} ${user.lastnames}`,
      user.id,
      `Se cambio el estado del documento: ${invoice.status.name} a ${status.name}.`,
    );

    return res.json({
      message: 'El documento ha sido revertido correctamente.',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al revertir el documento. Contacta con tu administrador.',
    });
  }
});

router.put('/printed/:id', async (req, res) => {
  // Obtiene la venta por su id
  const invoice = await req.conn
    .getRepository('Invoice')
    .createQueryBuilder('i')
    .where('i.company = :company', { company: req.user.cid })
    .andWhere('i.id = :id', { id: req.params.id })
    .leftJoinAndSelect('i.status', 's')
    .getOne();

  // Si el invoice no exite
  if (!invoice) {
    return res.status(500).json({ message: 'El documento seleccionado no existe.' });
  }

  // Verifica que tenga uno de los estados que pueden para imprimirse
  const statuses = [1, 2];
  if (!statuses.includes(invoice.status.id)) {
    return res.status(500).json({
      message: 'El documento no puede marcarse como impreso porque tiene un estado que no lo permite.',
    });
  }

  // marca el estado como impreso
  try {
    await req.conn
      .createQueryBuilder()
      .update('Invoice')
      .set({ status: 2 })
      .where('company = :company', { company: req.user.cid })
      .where('id = :id', { id: req.params.id })
      .execute();

    const user = await req.conn
      .getRepository('User')
      .createQueryBuilder('u')
      .where('u.id = :id', { id: req.user.uid })
      .getOne();

    const status = await req.conn
      .getRepository('InvoicesStatus')
      .createQueryBuilder('i')
      .where('i.id = :id', { id: 2 })
      .getOne();

    await addLog(
      req.conn,
      req.moduleName,
      `${user.names} ${user.lastnames}`,
      user.id,
      `Se cambio el estado del documento: ${invoice.status.name} a ${status.name}.`,
    );

    return res.json({
      message: 'El documento ha sido marcado como impreso correctamente.',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al marcar como impreso el documento. Contacta con tu administrador.',
    });
  }
});

router.put('/paid/:id', async (req, res) => {
  // Obtiene la venta por su id
  const invoice = await req.conn
    .getRepository('Invoice')
    .createQueryBuilder('i')
    .where('i.company = :company', { company: req.user.cid })
    .andWhere('i.id = :id', { id: req.params.id })
    .leftJoinAndSelect('i.status', 's')
    .getOne();

  // Si el invoice no exite
  if (!invoice) {
    return res.status(500).json({ message: 'El documento seleccionado no existe.' });
  }

  // Verifica que tenga uno de los estados que pueden para marcar como pagado
  const statuses = [2];
  if (!statuses.includes(invoice.status.id)) {
    return res.status(500).json({
      message: 'El documento no puede marcarse como impreso porque tiene un estado que no lo permite.',
    });
  }

  // marca el estado como pagado
  try {
    await req.conn
      .createQueryBuilder()
      .update('Invoice')
      .set({ status: 5 })
      .where('company = :company', { company: req.user.cid })
      .where('id = :id', { id: req.params.id })
      .execute();

    const user = await req.conn
      .getRepository('User')
      .createQueryBuilder('u')
      .where('u.id = :id', { id: req.user.uid })
      .getOne();

    const status = await req.conn
      .getRepository('InvoicesStatus')
      .createQueryBuilder('i')
      .where('i.id = :id', { id: 5 })
      .getOne();

    await addLog(
      req.conn,
      req.moduleName,
      `${user.names} ${user.lastnames}`,
      user.id,
      `Se cambio el estado del documento: ${invoice.status.name} a ${status.name}.`,
    );

    return res.json({
      message: 'El documento ha sido marcado como pagado correctamente.',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al marcar como pagado  el documento. Contacta con tu administrador.',
    });
  }
});

module.exports = router;
