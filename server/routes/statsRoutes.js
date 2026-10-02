const r = require("express").Router();
r.get(
  "/",
  require("../middleware/authMiddleware"),
  require("../controllers/statsController"),
);
module.exports = r;
