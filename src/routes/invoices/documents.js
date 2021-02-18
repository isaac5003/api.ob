const express = require('express');
const { checkRequired, addLog } = require('../../tools');
const router = express.Router();

router.get('/', async (req, res) => {
  const check = checkRequired(
    req.query,
    [
      { name: 'limit', type: 'integer', optional: true },
      { name: 'page', type: 'integer', optional: true },
      { name: 'active', type: 'boolean', optional: true },
      { name: 'search', type: 'string', optional: true },
      { name: 'type', type: 'integer', optional: true },
    ],
    true,
  );
  if (!check.success) {
    return res.status(400).json({ message: check.message });
  }

  try {
    const { cid } = req.user;
    const { limit, page, active, search, type } = req.query;

    let query = req.conn
      .getRepository('InvoicesDocument')
      .createQueryBuilder('id')
      .where('id.company = :company', { company: cid })
      .andWhere('id.isCurrentDocument = :isCurrentDocument', {
        isCurrentDocument: true,
      })
      .leftJoin('id.documentType', 'dt')
      .select('COUNT(id.id)', 'count');

    if (active != null) {
      query = query.andWhere('id.active = :active', {
        active: active == 'true',
      });
    }
    if (type) {
      query = query.andWhere('dt.id = :type', { type });
    }

    let { count } = await query.getRawOne();

    let documents = req.conn
      .getRepository('InvoicesDocument')
      .createQueryBuilder('id')
      .select([
        'id.id',
        'id.authorization',
        'id.initial',
        'id.final',
        'id.current',
        'id.active',
        'id.used',
        'dt.id',
        'dt.code',
        'dt.name',
      ])
      .leftJoin('id.documentType', 'dt')
      .where('id.company = :company', { company: cid })
      .andWhere('id.isCurrentDocument = :isCurrentDocument', {
        isCurrentDocument: true,
      })
      .orderBy('id.createdAt', 'DESC');

    let index = 1;
    if (search == null) {
      documents = documents.limit(limit).offset(limit ? parseInt(page ? page - 1 : 0) * parseInt(limit) : null);
      index = index * page ? (page - 1) * limit + 1 : 1;
    }

    if (active) {
      documents = documents.andWhere('id.active = :active', {
        active: active == 'true',
      });
    }
    if (type) {
      documents = documents.andWhere('dt.id = :type', { type });
    }
    documents = await documents.getMany();

    if (!active && !type) {
      const documentTypes = await req.conn
        .getRepository('InvoicesDocumentType')
        .createQueryBuilder('idt')
        .select(['idt.id', 'idt.name'])
        .orderBy('idt.id', 'ASC')
        .getMany();

      documents = documentTypes.map((dt) => {
        const found = documents.find((d) => d.documentType.id == dt.id);
        return found
          ? found
          : {
              id: null,
              authorization: null,
              initial: null,
              final: null,
              current: null,
              active: false,
              documentType: dt,
            };
      });
    }

    if (search != null) {
      documents = documents.filter((s) => s.name.toLowerCase().includes(search));
      count = documents.length;
    }

    return res.json({
      count,
      documents: documents.map((d) => {
        return { index: index++, ...d };
      }),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener el listado de los documentos.' });
  }
});

router.post('/', async (req, res) => {
  // Verifica los campos requeridos
  const check = checkRequired(req.body, [
    { name: 'authorization', type: 'string', optional: false },
    { name: 'initial', type: 'integer', optional: false },
    { name: 'final', type: 'integer', optional: false },
    { name: 'current', type: 'integer', optional: false },
    { name: 'documentType', type: 'integer', optional: false },
  ]);
  if (!check.success) {
    return res.status(400).json({ message: check.message });
  }

  // Obtiene los campos requeridos
  const { authorization, initial, final, current, documentType } = req.body;

  // Inserta el documento
  try {
    // Set active and isCurrentDocument to false for all documents with similar type
    await req.conn
      .createQueryBuilder()
      .update('InvoicesDocument')
      .set({
        active: false,
        isCurrentDocument: false,
      })
      .where('documentType = :documentType', { documentType })
      .execute();

    // 3. Inserta el nuevo tipo de documento
    const document = await req.conn
      .createQueryBuilder()
      .insert()
      .into('InvoicesDocument')
      .values({
        authorization,
        initial,
        final,
        current,
        documentType,
        isCurrentDocument: true,
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
      `Se ha creado el docuento con autorizacion : ${authorization}`,
    );

    // On success
    return res.json({
      message: 'El documento se ha creado correctamente.',
      id: document.raw[0].id,
    });
  } catch (error) {
    // On errror
    return res.status(400).json({
      message: 'Error al guardar el nuevo documento, contacta con tu administrador.',
    });
  }
});

router.get('/:type/layout', async (req, res) => {
  // Get document
  const document = await req.conn
    .getRepository('InvoicesDocument')
    .createQueryBuilder('id')
    .leftJoinAndSelect('id.documentType', 'dt')
    .where('id.company = :company', { company: req.user.cid })
    .andWhere('dt.id = :id', { id: req.params.type })
    .getOne();

  // If no exist
  if (!document) {
    return res.status(400).json({ message: 'El documento seleccionado no existe.' });
  }

  return res.json({ layout: document.documentLayout });
});

router.put('/documentlayout/:id', async (req, res) => {
  //validar los objetos necesarios en el req
  const check = checkRequired(req.body, [
    { name: 'configuration', type: 'string', optional: false },
    { name: 'resolution', type: 'array', optional: false },
    { name: 'header', type: 'array', optional: false },
    { name: 'details', type: 'object', optional: false },
    { name: 'totals', type: 'array', optional: false },
  ]);
  if (!check.success) {
    return res.status(400).json({ message: check.message });
  }

  //validando el arreglo header
  for (const header of req.body.header) {
    // valida el objeto header
    const checkHeader = checkRequired(header, [
      { name: 'x', type: 'integer', optional: true },
      { name: 'y', type: 'integer', optional: true },
      { name: 'length', type: 'integer', optional: true },
      { name: 'value', type: 'string', optional: true },
      { name: 'show', type: 'boolean', optional: false },
    ]);

    if (!checkHeader.success) {
      return res.status(400).json({ message: checkHeader.message });
    }
  }
  // valida el objeto details
  const checkDetails = checkRequired(req.body.details, [
    { name: 'position_y', optional: false },
    { name: 'fontSize', optional: false },
    { name: 'heigth', optional: false },
    { name: 'quantity', type: 'object', optional: false },
    { name: 'description', type: 'object', optional: false },
    { name: 'price', type: 'object', optional: false },
    { name: 'sujeto', type: 'object', optional: false },
    { name: 'exento', type: 'object', optional: false },
    { name: 'afecto', type: 'object', optional: false },
  ]);
  if (!checkDetails.success) {
    return res.status(400).json({ message: checkDetails.message });
  }

  //validando el arreglo totals
  for (const totals of req.body.totals) {
    // valida el objeto header
    const checkTotals = checkRequired(totals, [
      { name: 'x', type: 'integer', optional: true },
      { name: 'y', type: 'integer', optional: true },
      { name: 'value', type: 'string', optional: true },
      { name: 'show', type: 'boolean', optional: false },
    ]);

    if (!checkTotals.success) {
      return res.status(400).json({ message: checkTotals.message });
    }
  }

  //actualiza el campo layout en el documento
  try {
    await req.conn
      .createQueryBuilder()
      .update('InvoicesDocument')
      .set({
        layout: req.body,
      })
      .where('documentTypeId= :id', { id: req.params.id })
      .andWhere('isCurrentDocument = :current', { current: true })
      .execute();
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: 'Error al actualilzar las configuracion del documento, contacta con tu administrador.',
    });
  }

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
    `Se ha guardado la configuracion del documento: ${req.params.id}`,
  );

  return res.json({
    message: `La configuracion ha sido guardada correctamente.`,
  });
});

router.get('/:id', async (req, res) => {
  try {
    const document = await req.conn
      .getRepository('InvoicesDocument')
      .createQueryBuilder('id')
      .select(['id.id', 'id.authorization', 'id.initial', 'id.final', 'id.current', 'id.active', 'dt.id', 'dt.name'])
      .where('id.company = :company', { company: req.user.cid })
      .andWhere('id.id = :id', { id: req.params.id })
      .leftJoin('id.documentType', 'dt')
      .orderBy('id.createdAt', 'DESC')
      .getOne();

    return res.json({ document });
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener el detalle del documento.' });
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

  // Get document
  const document = await req.conn
    .getRepository('InvoicesDocument')
    .createQueryBuilder('id')
    .where('id.company = :company', { company: req.user.cid })
    .andWhere('id.id = :id', { id: req.params.id })
    .getOne();

  // If no exist
  if (!document) {
    return res.status(400).json({ message: 'El documento seleccionada no existe.' });
  }

  // If document exist updates it
  try {
    // return success
    await req.conn
      .createQueryBuilder()
      .update('InvoicesDocument')
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
      `Se cambio el estado del documento: ${document.name} a ${status ? 'ACTIVO' : 'INACTIVO'}.`,
    );

    return res.json({
      message: 'El documento ha sido actualizado correctamente.',
    });
  } catch (error) {
    // return error
    console.error(error);
    return res.status(500).json({
      message: 'Error al actualizar el documento. Contacta con tu administrador.',
    });
  }
});

router.delete('/:id', async (req, res) => {
  // Get the document
  const document = await req.conn
    .getRepository('InvoicesDocument')
    .createQueryBuilder('d')
    .where('d.company = :company', { company: req.user.cid })
    .andWhere('d.id = :id', { id: req.params.id })
    .getOne();

  // If no document exist
  if (!document) {
    return res.status(400).json({ message: 'El documento ingresado no existe' });
  }

  // If document exist
  // Check references in other tables
  // const references = await foundRelations(
  //   req.conn,
  //   "invoices_document",
  //   document.id,
  //   [],
  //   "invoicesZone"
  // );

  // // if references rejects deletion
  // if (references) {
  //   return res.status(400).json({
  //     message:
  //       "La zona no puede ser eliminada porque esta siendo utilizado en el sistema.",
  //   });
  // }

  // If no references deletes
  try {
    await req.conn
      .createQueryBuilder()
      .delete()
      .from('InvoicesDocument')
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
      `Se elimino el documeto con authorizacion: ${document.authorization}.`,
    );

    return res.json({
      message: 'El documento ha sido eliminado correctamente.',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al eliminar el documento. Conctacta a tu administrador.',
    });
  }
});

module.exports = router;
