const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
  req.moduleName = "Accounting";
  next();
});

router.use("/", require("./entries"));

module.exports = router;
