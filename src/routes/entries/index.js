const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
  req.moduleName = "Accounting";
  next();
});

router.use("/types", require("./entryType"));
router.use("/catalog", require("./catalog"));
router.use("/serie", require("./serie"));
router.use("/report", require("./report"));
router.use("/setting", require("./setting"));
router.use("/", require("./entries"));

module.exports = router;
