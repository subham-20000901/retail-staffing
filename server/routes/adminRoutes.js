const r = require('express').Router(), c = require('../controllers/adminController'), auth = require('../middleware/authMiddleware'), role = require('../middleware/roleMiddleware');
r.use(auth, role('admin'));
r.get('/users', c.users); r.get('/businesses', c.byRole('business')); r.get('/workers', c.byRole('worker'));
r.get('/jobs', c.jobs); r.get('/applications', c.applications); r.get('/assignments', c.assignments);
r.patch('/users/:id/status', c.setStatus);
module.exports = r;
