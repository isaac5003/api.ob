const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
  req.moduleName = "Customers";
  next();
});

router.use("/types", require("./types"));
router.use("/taxer-types", require("./taxerTypes"));
router.use("/type-naturals", require("./typeNaturals"));
router.use("/:customerId/branches", require("./branches"));
router.use("/", require("./customers"));

module.exports = router;
