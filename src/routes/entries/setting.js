const express = require('express');
const { checkRequired } = require('../../tools');
const { parseISO, differenceInMonths } = require('date-fns');
const router = express.Router();

const configurationExist = async req => {
  const settings = await req.conn
    .getRepository('AccountingSetting')
    .createQueryBuilder('as')
    .where('as.company = :company', { company: req.user.cid })
    .getOne();
  return settings ? true : false;
};

router.get('/general', async (req, res) => {
  try {
    const settings = await req.conn
      .getRepository('AccountingSetting')
      .createQueryBuilder('as')
      .select(['as.id', 'as.periodStart', 'as.peridoEnd'])
      .where('as.company = :company', { company: req.user.cid })
      .getOne();

    return res.json({
      general: {
        periodStart: settings.periodStart,
        peridoEnd: settings.peridoEnd,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener la configuracion general del modulo de contabilidad.',
    });
  }
});

router.put('/general', async (req, res) => {
  const check = checkRequired(req.body, [
    { name: 'periodStart', type: 'date', optional: false },
    { name: 'peridoEnd', type: 'date', optional: false },
  ]);
  if (!check.success) {
    return res.status(400).json({ message: check.message });
  }

  try {
    const { periodStart, peridoEnd } = req.body;

    if (differenceInMonths(parseISO(peridoEnd), parseISO(periodStart)) + 1 != 12) {
      return res.status(400).json({ message: 'El periodo fiscal debe  contener 12 meses exactos' });
    }

    if (await configurationExist(req)) {
      // Updates
      await req.conn
        .createQueryBuilder()
        .update('AccountingSetting')
        .set({ periodStart, peridoEnd })
        .where('company = :company', { company: req.user.cid })
        .execute();
    } else {
      // Creates
      await req.conn
        .createQueryBuilder()
        .insert()
        .into('AccountingSetting')
        .values({
          periodStart,
          peridoEnd,
          company: req.user.cid,
        })
        .execute();
    }
    return res.json({
      message: 'Configuracion general del modulo de contabilidad actualizada correctamente.',
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Error al actualizar la configuracion general del modulo de contabilidad.',
    });
  }
});

router.get('/signatures', async (req, res) => {
  try {
    const settings = await req.conn
      .getRepository('AccountingSetting')
      .createQueryBuilder('as')
      .select(['as.id', 'as.legal', 'as.accountant', 'as.auditor'])
      .where('as.company = :company', { company: req.user.cid })
      .getOne();

    return res.json({
      signatures: {
        legal: settings.legal,
        accountant: settings.accountant,
        auditor: settings.auditor,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener el detalle de los firmantes del modulo de contabilidad.',
    });
  }
});

router.put('/signatures', async (req, res) => {
  const check = checkRequired(req.body, [
    { name: 'legal', type: 'string', optional: false },
    { name: 'accountant', type: 'string', optional: false },
    { name: 'auditor', type: 'string', optional: false },
  ]);
  if (!check.success) {
    return res.status(400).json({ message: check.message });
  }

  try {
    const { legal, accountant, auditor } = req.body;
    if (await configurationExist(req)) {
      await req.conn
        .createQueryBuilder()
        .update('AccountingSetting')
        .set({ legal, accountant, auditor })
        .where('company = :company', { company: req.user.cid })
        .execute();
    } else {
      await req.conn
        .createQueryBuilder()
        .insert()
        .into('AccountingSetting')
        .values({
          legal,
          accountant,
          auditor,
          company: req.user.cid,
        })
        .execute();
    }

    return res.json({
      message: 'Configuracion de los firmantes del modulo de contabilidad actualizada correctamente.',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al actualizar la configuracion de los firmantes del modulo de contabilidad.',
    });
  }
});

router.get('/balance-general', async (req, res) => {
  try {
    const { balanceGeneral } = await req.conn
      .getRepository('AccountingSetting')
      .createQueryBuilder('as')
      .select('as.balanceGeneral')
      .where('as.company = :company', { company: req.user.cid })
      .getOne();

    return res.json({ balanceGeneral });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener la configuracion de balance general.',
    });
  }
});

router.put('/balance-general', async (req, res) => {
  const check = checkRequired(req.body, [{ name: 'settings', type: 'object', optional: false }]);
  if (!check.success) {
    return res.status(400).json({ message: check.message });
  }

  try {
    const { settings } = req.body;
    if (await configurationExist(req)) {
      await req.conn
        .createQueryBuilder()
        .update('AccountingSetting')
        .set({ balanceGeneral: settings })
        .where('company = :company', { company: req.user.cid })
        .execute();
    } else {
      await req.conn
        .createQueryBuilder()
        .insert()
        .into('AccountingSetting')
        .values({
          balanceGeneral: settings,
          company: req.user.cid,
        })
        .execute();
    }

    return res.json({
      message: 'Configuracion de balance general actualizada correctamente.',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al actualizar la configuracion de balance general.',
    });
  }
});

router.get('/estado-resultados', async (req, res) => {
  try {
    const { estadoResultados } = await req.conn
      .getRepository('AccountingSetting')
      .createQueryBuilder('as')
      .select('as.estadoResultados')
      .where('as.company = :company', { company: req.user.cid })
      .getOne();

    return res.json({ estadoResultados });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener la configuracion del estado de resultados.',
    });
  }
});

router.put('/estado-resultados', async (req, res) => {
  const check = checkRequired(req.body, [{ name: 'settings', type: 'array', optional: false }]);
  if (!check.success) {
    return res.status(400).json({ message: check.message });
  }

  try {
    const { settings } = req.body;
    if (await configurationExist(req)) {
      await req.conn
        .createQueryBuilder()
        .update('AccountingSetting')
        .set({ estadoResultados: settings })
        .where('company = :company', { company: req.user.cid })
        .execute();
    } else {
      await req.conn
        .createQueryBuilder()
        .insert()
        .into('AccountingSetting')
        .values({
          estadoResultados: settings,
          company: req.user.cid,
        })
        .execute();
    }

    return res.json({
      message: 'Configuracion de estado de resultados actualizada correctamente.',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al actualizar la configuracion de estado de resultados.',
    });
  }
});

module.exports = router;
