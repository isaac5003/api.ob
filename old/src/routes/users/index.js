const express = require("express");
const router = express.Router();

router.get("/", async ({ conn }, res) => {
  return res.json(
    await conn.getRepository("User").createQueryBuilder("user").getMany()
  );
});

module.exports = router;
