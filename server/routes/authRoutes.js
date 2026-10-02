const r = require("express").Router(),
  c = require("../controllers/authController"),
  auth = require("../middleware/authMiddleware");
r.post("/register", c.register);
r.post("/login", c.login);
r.get("/me", auth, c.me);
r.put("/me", auth, c.updateMe);
module.exports = r;
