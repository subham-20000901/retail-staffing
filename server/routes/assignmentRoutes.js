const r = require('express').Router(), c = require('../controllers/assignmentController'), auth = require('../middleware/authMiddleware'), role = require('../middleware/roleMiddleware');
r.use(auth); r.get('/my', role('worker'), c.my); r.get('/', role('business', 'admin'), c.all);
module.exports = r;
