const express = require("express");
const { checkRequired } = require("../../tools");
const { format } = require("date-fns");
const router = express.Router();

router.get("/general", async (req, res) => {
  const check = checkRequired(req.query, [
    { name: "startDate", type: "date", optional: false },
    { name: "endDate", type: "date", optional: false },
    { name: "customer", type: "string", optional: true },
    { name: "documentType", type: "string", optional: true },
    { name: "invoicesSeller", type: "string", optional: true },
    { name: "invoicesZone", type: "string", optional: true },
    { name: "status", type: "string", optional: true },
    { name: "service", type: "string", optional: true },
  ]);
  if (!check.success) {
    return res.status(400).json({ message: check.message });
  }

  try {
    const {
      startDate,
      endDate,
      documentType,
      customer,
      invoicesSeller,
      invoicesZone,
      status,
      service
    } = req.query

    let documentTypes = req.conn
      .getRepository('InvoicesDocumentType')
      .createQueryBuilder('idt');

    if (documentType) {
      documentTypes = documentTypes.where("idt.id = :documentType", { documentType })
    }
    documentTypes = await documentTypes.getMany();

    // obtiene las ventas que aplican segun filtros
    let sales = req.conn
      .getRepository("Invoice")
      .createQueryBuilder("i")
      .where("i.company = :company", { company: req.user.cid })
      .andWhere("i.invoiceDate >= :startDate", { startDate })
      .andWhere("i.invoiceDate <= :endDate", { endDate })
      .leftJoinAndSelect("i.documentType", "dt")
      .leftJoinAndSelect("i.customer", "cu")
      .leftJoinAndSelect("i.customerType", "ct")
      .leftJoinAndSelect("i.invoicesSeller", "is")
      .leftJoinAndSelect("i.invoicesZone", "iz")
      .leftJoinAndSelect("i.status", "st")
      .leftJoinAndSelect("i.details", "de")
      .leftJoinAndSelect("de.service", "se");

    if (customer) {
      sales = sales.where("cu.id = :customer", { customer })
    }
    if (invoicesSeller) {
      sales = sales.where("is.id = :invoicesSeller", { invoicesSeller })
    }
    if (invoicesZone) {
      sales = sales.where("iz.id = :invoicesZone", { invoicesZone })
    }
    if (status) {
      sales = sales.where("st.id = :status", { status })
    }
    if (service) {
      sales = sales.where("se.id = :service", { service })
    }

    sales = await sales.getMany();

    const report = documentTypes.map(dt => {
      const documents = sales
        .filter(s => s.documentType.id == dt.id)
        .map(d => {
          return {
            customer: d.customerName,
            date: format(new Date(d.invoiceDate), 'dd/MM/yyyy'),
            documentNumber: `${d.authorization} - ${d.sequence}`,
            vGravada: parseFloat(d.subtotal),
            vNSujeta: parseFloat(d.ventasNoSujetas),
            vExenta: parseFloat(d.ventasExentas),
            iva: parseFloat(d.iva),
            ivaRetenido: parseFloat(d.ivaRetenido),
            total: parseFloat(d.ventaTotal),
          }
        })
      return {
        name: dt.name,
        code: dt.code,
        count: documents.length,
        documents,
        vGravadaTotal: documents.reduce((a, b) => a + b.vGravada, 0),
        vNSujetaTotal: documents.reduce((a, b) => a + b.vNSujeta, 0),
        vExentaTotal: documents.reduce((a, b) => a + b.vExenta, 0),
        ivaTotal: documents.reduce((a, b) => a + b.iva, 0),
        ivaRetenidoTotal: documents.reduce((a, b) => a + b.ivaRetenido, 0),
        totalTotal: documents.reduce((a, b) => a + b.total, 0),
      }
    })


    return res.json({ report });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error al obtener el reporte de ventas general." });
  }
});

module.exports = router;
