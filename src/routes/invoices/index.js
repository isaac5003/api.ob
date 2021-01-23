const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
  req.moduleName = "Invoices";
  next();
});

router.use("/zones", require("./zones"));
router.use("/sellers", require("./sellers"));
router.use("/document-types", require("./documentTypes"));
router.use("/payment-condition", require("./paymentCondition"));
router.use("/documents", require("./documents"));
router.use("/status", require("./status"));
router.use("/report", require("./report"));
router.use("/", require("./invoices"));

module.exports = router;
