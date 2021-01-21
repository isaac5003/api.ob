const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
  req.moduleName = "Services";
  next();
});
router.use("/selling-types", require("./sellingTypes"));
router.use("/status", require("./status"));
router.use("/report", require("./report"));
router.use("/", require("./services"));

module.exports = router;
