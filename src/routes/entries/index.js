const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
  req.moduleName = "Accounting";
  next();
});

router.use("/types", require("./entryTypes"));
router.use("/catalog", require("./catalog"));
router.use("/serie", require("./serie"));
router.use("/", require("./entries"));

module.exports = router;
