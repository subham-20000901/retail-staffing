const r = require("express").Router(),
  c = require("../controllers/jobController"),
  auth = require("../middleware/authMiddleware"),
  role = require("../middleware/roleMiddleware");
r.use(auth);
r.post("/", role("business"), c.create);
r.get("/", c.list);
r.get("/my", role("business"), c.my);
r.get("/:id", c.getOne);
r.put("/:id", role("business"), c.update);
r.delete("/:id", role("business"), c.cancel);
r.post("/:id/apply", role("worker"), c.apply);
module.exports = r;
