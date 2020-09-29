const express = require("express");
const { checkRequired, foundRelations, addLog } = require("../../tools");
const router = express.Router();

router.use((req, res, next) => {
  req.moduleName = "Invoices";
  next();
});

router.use("/zones", require("./zones"));

module.exports = router;
