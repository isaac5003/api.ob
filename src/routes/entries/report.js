const express = require('express');
const { checkRequired } = require('../../tools');
const { startOfMonth, endOfMonth, format } = require('date-fns');
const { es } = require('date-fns/locale');
const router = express.Router();

router.get('/diario-mayor', async (req, res) => {
  const check = checkRequired(req.query, [{ name: 'date', type: 'date', optional: false }]);
  if (!check.success) {
    return res.status(400).json({ message: check.message });
  }

  try {
    const date = new Date(req.query.date);
    //informacin de signatures
    const signatures = await req.conn
      .getRepository('AccountingSetting')
      .createQueryBuilder('as')
      .select(['as.id', 'as.legal', 'as.accountant', 'as.auditor'])
      .where('as.company = :company', { company: req.user.cid })
      .getOne();

    //informacin de la cmpañia
    const company = await req.conn
      .getRepository('Company')
      .createQueryBuilder('c')
      .select(['c.name', 'c.nrc', 'c.nit'])
      .where('c.id = :id', { id: req.user.cid })
      .getOne();

    const catalog = await req.conn
      .getRepository('AccountingCatalog')
      .createQueryBuilder('d')
      .where('d.company = :company', { company: req.user.cid })
      .getMany();

    // obtiene los detalles de la partida del rango seleccionado
    const rangeDetails = await req.conn
      .getRepository('AccountingEntryDetail')
      .createQueryBuilder('d')
      .where('d.company = :company', { company: req.user.cid })
      .andWhere('e.date >= :startDate', { startDate: startOfMonth(date) })
      .andWhere('e.date <= :endDate', { endDate: endOfMonth(date) })
      .leftJoinAndSelect('d.accountingEntry', 'e')
      .leftJoinAndSelect('d.accountingCatalog', 'c')
      .getMany();

    // obtiene los detalles de la partida anteriores al rango seleccionado
    const previousDetails = await req.conn
      .getRepository('AccountingEntryDetail')
      .createQueryBuilder('d')
      .where('d.company = :company', { company: req.user.cid })
      .andWhere('e.date < :date', { date: startOfMonth(date) })
      .leftJoinAndSelect('d.accountingEntry', 'e')
      .leftJoinAndSelect('d.accountingCatalog', 'c')
      .getMany();

    // define el listado de cuentas contables afectadas en el periodo seleccionado
    const affectedCatalog = [...new Set(rangeDetails.map(d => d.accountingCatalog.code))];

    let accounts = [];
    // obtiene el saldo inicial por cuenta
    accounts = affectedCatalog
      .map(c => {
        const account = catalog.find(ct => ct.code == c);
        const abono = previousDetails
          .filter(d => d.accountingCatalog.code == c)
          .reduce((a, b) => a + (b.abono ? b.abono : 0), 0);
        const cargo = previousDetails
          .filter(d => d.accountingCatalog.code == c)
          .reduce((a, b) => a + (b.cargo ? b.cargo : 0), 0);
        const applicable = rangeDetails.filter(d => d.accountingCatalog.code == c);
        const movements = [];
        for (let item of applicable) {
          const found = movements.find(m => m.date == item.accountingEntry.date);
          if (found) {
            found.cargo = found.cargo + (item.cargo ? item.cargo : 0);
            found.abono = found.abono + (item.abono ? item.abono : 0);
          } else {
            movements.push({
              date: item.accountingEntry.date,
              cargo: item.cargo ? item.cargo : 0,
              abono: item.abono ? item.abono : 0,
              balance: 0,
            });
          }
        }
        const initialBalance = account.isAcreedora ? abono - cargo : cargo - abono;
        let currentBalance = initialBalance;
        return {
          code: c,
          name: account.name,
          initialBalance: parseFloat(initialBalance.toFixed(2)),
          movements: movements
            .sort((a, b) => {
              if (new Date(a.date) > new Date(b.date)) return 1;
              if (new Date(a.date) < new Date(b.date)) return -1;
              return 0;
            })
            .map(m => {
              currentBalance = parseFloat(
                (currentBalance + (account.isAcreedora ? m.abono - m.cargo : m.cargo - m.abono)).toFixed(2),
              );
              return {
                ...m,
                date: format(new Date(m.date), 'dd/MM/yyyy'),
                balance: currentBalance,
              };
            }),
          totalAbono: movements.reduce((a, b) => a + b.abono, 0),
          totalCargo: movements.reduce((a, b) => a + b.cargo, 0),
          currentBalance,
        };
      })
      .sort((a, b) => {
        if (a.code < b.code) return -1;
        if (a.code > b.code) return 1;
        return 0;
      });

    const name = `LIBRO DIARIO MAYOR PARA EL MES DE ${format(date, 'MMMM yyyy', { locale: es }).toUpperCase()}`;
    return res.json({
      signatures: {
        legal: signatures.legal,
        accountant: signatures.accountant,
        auditor: signatures.auditor,
      },
      company,
      name,
      accounts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al obtener el reporte de libro diario mayor.' });
  }
});

router.get('/auxiliares', async (req, res) => {
  const check = checkRequired(req.query, [{ name: 'date', type: 'date', optional: false }]);
  if (!check.success) {
    return res.status(400).json({ message: check.message });
  }

  try {
    //informacin de signatures
    const signatures = await req.conn
      .getRepository('AccountingSetting')
      .createQueryBuilder('as')
      .select(['as.id', 'as.legal', 'as.accountant', 'as.auditor'])
      .where('as.company = :company', { company: req.user.cid })
      .getOne();

    //informacin de la cmpañia
    const company = await req.conn
      .getRepository('Company')
      .createQueryBuilder('c')
      .select(['c.name', 'c.nrc', 'c.nit'])
      .where('c.id = :id', { id: req.user.cid })
      .getOne();

    const date = new Date(req.query.date);

    const catalog = await req.conn
      .getRepository('AccountingCatalog')
      .createQueryBuilder('d')
      .where('d.company = :company', { company: req.user.cid })
      .getMany();

    // obtiene los detalles de la partida del rango seleccionado
    const rangeDetails = await req.conn
      .getRepository('AccountingEntryDetail')
      .createQueryBuilder('d')
      .where('d.company = :company', { company: req.user.cid })
      .andWhere('e.date >= :startDate', { startDate: startOfMonth(date) })
      .andWhere('e.date <= :endDate', { endDate: endOfMonth(date) })
      .leftJoinAndSelect('d.accountingEntry', 'e')
      .leftJoinAndSelect('d.accountingCatalog', 'c')
      .getMany();

    // obtiene los detalles de la partida anteriores al rango seleccionado
    const previousDetails = await req.conn
      .getRepository('AccountingEntryDetail')
      .createQueryBuilder('d')
      .where('d.company = :company', { company: req.user.cid })
      .andWhere('e.date < :date', { date: startOfMonth(date) })
      .leftJoinAndSelect('d.accountingEntry', 'e')
      .leftJoinAndSelect('d.accountingCatalog', 'c')
      .getMany();

    // define el listado de cuentas contables afectadas en el periodo seleccionado
    const affectedCatalog = [...new Set(rangeDetails.map(d => d.accountingCatalog.code))];

    let accounts = [];
    // obtiene el saldo inicial por cuenta
    accounts = affectedCatalog
      .map(c => {
        const account = catalog.find(ct => ct.code == c);
        const abono = previousDetails
          .filter(d => d.accountingCatalog.code == c)
          .reduce((a, b) => a + (b.abono ? b.abono : 0), 0);
        const cargo = previousDetails
          .filter(d => d.accountingCatalog.code == c)
          .reduce((a, b) => a + (b.cargo ? b.cargo : 0), 0);
        const applicable = rangeDetails.filter(d => d.accountingCatalog.code == c);
        const movements = applicable.map(a => {
          return {
            entryNumber: `Partida #${a.accountingEntry.serie}`,
            entryName: a.concept,
            date: a.accountingEntry.date,
            cargo: parseFloat(a.cargo ? a.cargo.toFixed(2) : 0),
            abono: parseFloat(a.abono ? a.abono.toFixed(2) : 0),
            balance: 0,
          };
        });
        const initialBalance = account.isAcreedora ? abono - cargo : cargo - abono;
        let currentBalance = initialBalance;
        return {
          code: c,
          name: account.name,
          initialBalance: parseFloat(initialBalance.toFixed(2)),
          movements: movements
            .sort((a, b) => {
              if (new Date(a.date) > new Date(b.date)) return 1;
              if (new Date(a.date) < new Date(b.date)) return -1;
              return 0;
            })
            .map(m => {
              currentBalance = parseFloat(
                (currentBalance + (account.isAcreedora ? m.abono - m.cargo : m.cargo - m.abono)).toFixed(2),
              );
              return {
                ...m,
                date: format(new Date(m.date), 'dd/MM/yyyy'),
                balance: currentBalance,
              };
            }),
          totalAbono: parseFloat(movements.reduce((a, b) => a + b.abono, 0).toFixed(2)),
          totalCargo: parseFloat(movements.reduce((a, b) => a + b.cargo, 0).toFixed(2)),
          currentBalance,
        };
      })
      .sort((a, b) => {
        if (a.code < b.code) return -1;
        if (a.code > b.code) return 1;
        return 0;
      });

    const name = `LIBROS DE AUXILIARES PARA EL MES DE ${format(date, 'MMMM yyyy', { locale: es }).toUpperCase()}`;
    return res.json({
      signatures: {
        legal: signatures.legal,
        accountant: signatures.accountant,
        auditor: signatures.auditor,
      },
      company,
      name,
      accounts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al obtener el reporte de auxiliares.' });
  }
});

router.get('/account-movements', async (req, res) => {
  const check = checkRequired(req.query, [
    { name: 'startDate', type: 'date', optional: false },
    { name: 'endDate', type: 'date', optional: false },
    { name: 'selectedAccounts', type: 'array', optional: false },
  ]);
  if (!check.success) {
    return res.status(400).json({ message: check.message });
  }

  try {
    const { startDate, endDate, selectedAccounts } = req.query;

    const catalog = await req.conn
      .getRepository('AccountingCatalog')
      .createQueryBuilder('d')
      .where('d.company = :company', { company: req.user.cid })
      .getMany();

    //informacin de signatures
    const signatures = await req.conn
      .getRepository('AccountingSetting')
      .createQueryBuilder('as')
      .select(['as.id', 'as.legal', 'as.accountant', 'as.auditor'])
      .where('as.company = :company', { company: req.user.cid })
      .getOne();

    //informacin de la cmpañia
    const company = await req.conn
      .getRepository('Company')
      .createQueryBuilder('c')
      .select(['c.name', 'c.nrc', 'c.nit'])
      .where('c.id = :id', { id: req.user.cid })
      .getOne();

    // obtiene los detalles de la partida del rango seleccionado
    const rangeDetails = await req.conn
      .getRepository('AccountingEntryDetail')
      .createQueryBuilder('d')
      .where('d.company = :company', { company: req.user.cid })
      .andWhere('e.date >= :startDate', { startDate })
      .andWhere('e.date <= :endDate', { endDate })
      .andWhere('c.id IN (:...ids)', { ids: JSON.parse(selectedAccounts) })
      .leftJoinAndSelect('d.accountingEntry', 'e')
      .leftJoinAndSelect('d.accountingCatalog', 'c')
      .getMany();

    // obtiene los detalles de la partida anteriores al rango seleccionado
    const previousDetails = await req.conn
      .getRepository('AccountingEntryDetail')
      .createQueryBuilder('d')
      .where('d.company = :company', { company: req.user.cid })
      .andWhere('e.date < :startDate', { startDate })
      .andWhere('c.id IN (:...ids)', { ids: JSON.parse(selectedAccounts) })
      .leftJoinAndSelect('d.accountingEntry', 'e')
      .leftJoinAndSelect('d.accountingCatalog', 'c')
      .getMany();

    // define el listado de cuentas contables afectadas en el periodo seleccionado
    const affectedCatalog = [...new Set(rangeDetails.map(d => d.accountingCatalog.code))];

    let accounts = [];
    // obtiene el saldo inicial por cuenta
    accounts = affectedCatalog
      .map(c => {
        const account = catalog.find(ct => ct.code == c);
        const abono = previousDetails
          .filter(d => d.accountingCatalog.code == c)
          .reduce((a, b) => a + (b.abono ? b.abono : 0), 0);
        const cargo = previousDetails
          .filter(d => d.accountingCatalog.code == c)
          .reduce((a, b) => a + (b.cargo ? b.cargo : 0), 0);
        const applicable = rangeDetails.filter(d => d.accountingCatalog.code == c);
        const movements = applicable.map(a => {
          return {
            entryNumber: `Partida #${a.accountingEntry.serie}`,
            entryName: a.concept,
            date: a.accountingEntry.date,
            cargo: parseFloat(a.cargo ? a.cargo.toFixed(2) : 0),
            abono: parseFloat(a.abono ? a.abono.toFixed(2) : 0),
            balance: 0,
          };
        });
        const initialBalance = account.isAcreedora ? abono - cargo : cargo - abono;
        let currentBalance = initialBalance;
        return {
          code: c,
          name: account.name,
          initialBalance: parseFloat(initialBalance.toFixed(2)),
          movements: movements
            .sort((a, b) => {
              if (new Date(a.date) > new Date(b.date)) return 1;
              if (new Date(a.date) < new Date(b.date)) return -1;
              return 0;
            })
            .map(m => {
              currentBalance = parseFloat(
                (currentBalance + (account.isAcreedora ? m.abono - m.cargo : m.cargo - m.abono)).toFixed(2),
              );
              return {
                ...m,
                date: format(new Date(m.date), 'dd/MM/yyyy'),
                balance: currentBalance,
              };
            }),
          totalAbono: parseFloat(movements.reduce((a, b) => a + b.abono, 0).toFixed(2)),
          totalCargo: parseFloat(movements.reduce((a, b) => a + b.cargo, 0).toFixed(2)),
          currentBalance,
        };
      })
      .sort((a, b) => {
        if (a.code < b.code) return -1;
        if (a.code > b.code) return 1;
        return 0;
      });

    const name = `DETALLE DE MOVIMIENTO DE CUENTAS EN EL PERÍODO DEL ${format(
      new Date(startDate),
      'dd/MM/yyyy',
    )} AL ${format(new Date(endDate), 'dd/MM/yyyy')}`;
    return res.json({
      signatures: {
        legal: signatures.legal,
        accountant: signatures.accountant,
        auditor: signatures.auditor,
      },
      company,
      name,
      accounts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Error al obtener el reporte de movimiento de cuentas.',
    });
  }
});

router.get('/balance-comprobacion', async (req, res) => {
  const check = checkRequired(req.query, [{ name: 'date', type: 'date', optional: false }]);
  if (!check.success) {
    return res.status(400).json({ message: check.message });
  }

  try {
    const date = new Date(req.query.date);
    //informacin de signatures
    const signatures = await req.conn
      .getRepository('AccountingSetting')
      .createQueryBuilder('as')
      .select(['as.id', 'as.legal', 'as.accountant', 'as.auditor'])
      .where('as.company = :company', { company: req.user.cid })
      .getOne();

    //informacin de la cmpañia
    const company = await req.conn
      .getRepository('Company')
      .createQueryBuilder('c')
      .select(['c.name', 'c.nrc', 'c.nit'])
      .where('c.id = :id', { id: req.user.cid })
      .getOne();
    let catalog = await req.conn
      .getRepository('AccountingCatalog')
      .createQueryBuilder('d')
      .where('d.company = :company', { company: req.user.cid })
      .getMany();

    // obtiene los detalles de la partida del rango seleccionado
    const rangeDetails = await req.conn
      .getRepository('AccountingEntryDetail')
      .createQueryBuilder('d')
      .where('d.company = :company', { company: req.user.cid })
      .andWhere('e.date >= :startDate', { startDate: startOfMonth(date) })
      .andWhere('e.date <= :endDate', { endDate: endOfMonth(date) })
      .leftJoinAndSelect('d.accountingEntry', 'e')
      .leftJoinAndSelect('d.accountingCatalog', 'c')
      .getMany();

    // obtiene los detalles de la partida anteriores al rango seleccionado
    const previousDetails = await req.conn
      .getRepository('AccountingEntryDetail')
      .createQueryBuilder('d')
      .where('d.company = :company', { company: req.user.cid })
      .andWhere('e.date < :date', { date: startOfMonth(date) })
      .leftJoinAndSelect('d.accountingEntry', 'e')
      .leftJoinAndSelect('d.accountingCatalog', 'c')
      .getMany();

    // define el listado de cuentas contables afectadas en el periodo seleccionado
    const affectedCatalog = [...rangeDetails.map(d => d.accountingCatalog.code)].concat(
      ...previousDetails.map(d => d.accountingCatalog.code),
    );

    balanceComprobacion = catalog
      .filter(c => {
        return affectedCatalog.some(ac => ac.startsWith(c.code));
      })
      .map(c => {
        let initialBalance = previousDetails
          .filter(d => d.accountingCatalog.code.startsWith(c.code))
          .reduce((a, b) => {
            return (
              a +
              (b.accountingCatalog.isAcreedora
                ? (b.abono ? b.abono : 0) - (b.cargo ? b.cargo : 0)
                : (b.cargo ? b.cargo : 0) - (b.abono ? b.abono : 0))
            );
          }, 0);
        initialBalance = parseFloat(initialBalance.toFixed(2));
        let cargo = rangeDetails
          .filter(d => d.accountingCatalog.code.startsWith(c.code))
          .reduce((a, b) => a + (b.cargo ? b.cargo : 0), 0);
        cargo = parseFloat(cargo.toFixed(2));
        let abono = rangeDetails
          .filter(d => d.accountingCatalog.code.startsWith(c.code))
          .reduce((a, b) => a + (b.abono ? b.abono : 0), 0);
        abono = parseFloat(abono.toFixed(2));
        let currentBalance = c.isAcreedora ? abono - cargo : cargo - abono;
        currentBalance = parseFloat(currentBalance.toFixed(2));
        return {
          code: c.code,
          name: c.name,
          initialBalance,
          cargo,
          abono,
          currentBalance,
          actualBalance: initialBalance + currentBalance,
        };
      })
      .sort((a, b) => {
        if (a.code < b.code) return -1;
        if (a.code > b.code) return 1;
        return 0;
      })
      .filter(c => c.initialBalance > 0 || c.cargo > 0 || c.abono > 0);

    const name = `BALANCE DE COMPROBACIÓN AL ${format(endOfMonth(date), 'dd - MMMM - yyyy', { locale: es })
      .split('-')
      .join('de')
      .toUpperCase()}`;
    return res.json({
      signatures: {
        legal: signatures.legal,
        accountant: signatures.accountant,
        auditor: signatures.auditor,
      },
      company,
      name,
      balanceComprobacion,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener el reporte de balance de comprobacion.',
    });
  }
});

router.get('/balance-general', async (req, res) => {
  const check = checkRequired(req.query, [
    { name: 'startDate', type: 'date', optional: true },
    { name: 'endDate', type: 'date', optional: false },
  ]);
  if (!check.success) {
    return res.status(400).json({ message: check.message });
  }

  try {
    let { startDate, endDate } = req.query;
    endDate = new Date(endDate);

    //informacin de signatures
    const signatures = await req.conn
      .getRepository('AccountingSetting')
      .createQueryBuilder('as')
      .select(['as.id', 'as.legal', 'as.accountant', 'as.auditor'])
      .where('as.company = :company', { company: req.user.cid })
      .getOne();

    //informacin de la cmpañia
    const company = await req.conn
      .getRepository('Company')
      .createQueryBuilder('c')
      .select(['c.name', 'c.nrc', 'c.nit'])
      .where('c.id = :id', { id: req.user.cid })
      .getOne();

    let { balanceGeneral } = await req.conn
      .getRepository('AccountingSetting')
      .createQueryBuilder('as')
      .where('as.company = :company', { company: req.user.cid })
      .getOne();

    if (!balanceGeneral) {
      return res.status(400).json({
        message: 'No hay configuracion valida guardada para el Balance general.',
      });
    }

    if (Object.values(balanceGeneral.special).filter(v => v == '').length > 0) {
      return res.status(400).json({
        message: 'Se deben definir las cuentas de utiliadades y perdidas para el periodo anterior y el actual.',
      });
    }

    let catalog = await req.conn
      .getRepository('AccountingCatalog')
      .createQueryBuilder('d')
      .where('d.company = :company', { company: req.user.cid })
      .getMany();

    // obtiene los detalles de la partida del rango seleccionado
    let rangeDetails = req.conn
      .getRepository('AccountingEntryDetail')
      .createQueryBuilder('d')
      .where('d.company = :company', { company: req.user.cid });

    if (startDate) {
      rangeDetails = rangeDetails.andWhere('e.date >= :startDate', { startDate: new Date(startDate) });
    }

    rangeDetails = await rangeDetails
      .andWhere('e.date <= :endDate', { endDate })
      .leftJoinAndSelect('d.accountingEntry', 'e')
      .leftJoinAndSelect('d.accountingCatalog', 'c')
      .getMany();

    balanceGeneral = balanceGeneral.report.map(s => {
      let add = 0;
      let objaccount = {};
      if (s.id == 3) {
        const resacreedora = rangeDetails
          .filter(
            d =>
              (d.accountingCatalog.code.startsWith('4') || d.accountingCatalog.code.startsWith('5')) &&
              d.accountingCatalog.isAcreedora,
          )
          .reduce(
            (a, b) => {
              return {
                cargo: a.cargo + (b.cargo ? b.cargo : 0),
                abono: a.abono + (b.abono ? b.abono : 0),
              };
            },
            { cargo: 0, abono: 0 },
          );
        const resdeudora = rangeDetails
          .filter(
            d =>
              (d.accountingCatalog.code.startsWith('4') || d.accountingCatalog.code.startsWith('5')) &&
              !d.accountingCatalog.isAcreedora,
          )
          .reduce(
            (a, b) => {
              return {
                cargo: a.cargo + (b.cargo ? b.cargo : 0),
                abono: a.abono + (b.abono ? b.abono : 0),
              };
            },
            { cargo: 0, abono: 0 },
          );
        add = resacreedora.abono + resdeudora.abono - (resacreedora.cargo + resdeudora.cargo);
        objaccount = {
          code: catalog.find(c =>
            c.id = add >= 0 ? balanceGeneral.special.curre_gain : balanceGeneral.special.curre_lost,
          ).code,
          name: catalog.find(c =>
            c.id = add >= 0 ? balanceGeneral.special.curre_gain : balanceGeneral.special.curre_lost,
          ).name,
          total: parseFloat(add.toFixed(2)),
        };
      }
      return {
        code: s.id,
        name: s.display,
        total: parseFloat(
          (
            s.children
              .map(c => {
                const totalniveldos = c.children
                  .map(ch => {
                    const totalniveltres = rangeDetails
                      .filter(d => d.accountingCatalog.code.startsWith(ch.id))
                      .reduce(
                        (a, b) =>
                          a +
                          (b.accountingCatalog.isAcreedora
                            ? (b.abono ? b.abono : 0) - (b.cargo ? b.cargo : 0)
                            : (b.cargo ? b.cargo : 0) - (b.abono ? b.abono : 0)),
                        0,
                      );
                    ch.total = totalniveltres;
                    return totalniveltres;
                  })
                  .reduce((a, b) => a + b, 0);
                c.total = totalniveldos;
                return totalniveldos;
              })
              .reduce((a, b) => a + b, 0) + add
          ).toFixed(2),
        ),
        accounts: s.children.map(c => {
          const accounts = c.children
            .map(ch => {
              return {
                code: ch.id,
                name: ch.display,
                total: parseFloat(ch.total.toFixed(2)),
              };
            })
            .filter(ch => ch.total > 0);
          if (s.id == 3) {
            accounts.push(objaccount);
          }
          return {
            code: c.id,
            name: c.display,
            total: parseFloat(c.total.toFixed(2)),
            accounts,
          };
        }),
      };
    });

    const name = `BALANCE GENERAL AL ${format(new Date(endDate), 'dd/MM/yyyy')}`;

    return res.json({
      signatures: {
        legal: signatures.legal,
        accountant: signatures.accountant,
        auditor: signatures.auditor,
      },
      company,
      name,
      balanceGeneral,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al obtener el reporte de balance general.' });
  }
});

router.get('/estado-resultados', async (req, res) => {
  const check = checkRequired(req.query, [
    { name: 'startDate', type: 'date', optional: true },
    { name: 'endDate', type: 'date', optional: false },
  ]);
  if (!check.success) {
    return res.status(400).json({ message: check.message });
  }

  try {
    let { startDate, endDate } = req.query;
    endDate = new Date(endDate);

    //informacin de signatures
    const signatures = await req.conn
      .getRepository('AccountingSetting')
      .createQueryBuilder('as')
      .select(['as.id', 'as.legal', 'as.accountant', 'as.auditor'])
      .where('as.company = :company', { company: req.user.cid })
      .getOne();

    //informacin de la cmpañia
    const company = await req.conn
      .getRepository('Company')
      .createQueryBuilder('c')
      .select(['c.name', 'c.nrc', 'c.nit'])
      .where('c.id = :id', { id: req.user.cid })
      .getOne();

    let { estadoResultados } = await req.conn
      .getRepository('AccountingSetting')
      .createQueryBuilder('as')
      .where('as.company = :company', { company: req.user.cid })
      .getOne();

    // obtiene los detalles de la partida del rango seleccionado
    let rangeDetails = req.conn
      .getRepository('AccountingEntryDetail')
      .createQueryBuilder('d')
      .where('d.company = :company', { company: req.user.cid });

    if (startDate) {
      rangeDetails = rangeDetails.andWhere('e.date >= :startDate', { startDate: new Date(startDate) });
    }
    rangeDetails = await rangeDetails
      .andWhere('e.date <= :endDate', { endDate })
      .leftJoinAndSelect('d.accountingEntry', 'e')
      .leftJoinAndSelect('d.accountingCatalog', 'c')
      .getMany();

    let saldoacumulado = 0;
    estadoResultados = estadoResultados
      .filter(setting => setting.show)
      .map(account => {
        let total = 0;
        if (account.children) {
          total = account.children
            .map(children => children.id)
            .map(catalogo =>
              rangeDetails
                .filter(d => d.accountingCatalog.code.startsWith(catalogo))
                .reduce((a, b) => a + ((b.abono ? b.abono : 0) - (b.cargo ? b.cargo : 0)), 0),
            )
            .reduce((a, b) => a + b, 0);
          saldoacumulado = parseFloat(saldoacumulado) + parseFloat(total);
        } else {
          total = saldoacumulado;
        }

        let children = null;
        if (account.details) {
          children = account.children.map(ch => {
            return {
              name: ch.display,
              total: rangeDetails
                .filter(detail => detail.accountingCatalog.code.startsWith(ch.id))
                .reduce((a, b) => a + ((b.abono ? b.abono : 0) - (b.cargo ? b.cargo : 0)), 0),
            };
          });
        }

        return {
          name: account.display,
          total: parseFloat(total.toFixed(2)),
          type: !account.children ? 'total' : null,
          children,
        };
      });
    const name = `ESTADO DE RESULTADOS AL ${format(new Date(endDate), 'dd/MM/yyyy')}`;

    return res.json({
      signatures: {
        legal: signatures.legal,
        accountant: signatures.accountant,
        auditor: signatures.auditor,
      },
      company,
      name,
      estadoResultados,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener el reporte de estado de resultados.',
    });
  }
});

module.exports = router;
