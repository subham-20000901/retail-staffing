const r = require('express').Router(), c = require('../controllers/applicationController'), auth = require('../middleware/authMiddleware'), role = require('../middleware/roleMiddleware');
r.use(auth);
r.get('/my', role('worker'), c.my); r.get('/job/:jobId', role('business', 'admin'), c.forJob);
r.patch('/:id/approve', role('business', 'admin'), c.approve); r.patch('/:id/reject', role('business', 'admin'), c.reject);
module.exports = r;
