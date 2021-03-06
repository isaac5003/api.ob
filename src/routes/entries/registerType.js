const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const registerTypes = await req.conn
      .getRepository('AccountingRegisterType')
      .createQueryBuilder('art')
      .select(['art.id', 'art.name'])
      .where('art.company = :company', { company: req.user.cid })
      .orderBy('art.createdAt', 'DESC')
      .getMany();

    return res.json({
      registerTypes,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener el listado de tipos de partida.' });
  }
});

module.exports = router;
