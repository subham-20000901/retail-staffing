const Assignment = require('../models/Assignment');
const pop = q => q.populate('jobId').populate('workerId', 'name email phone').populate('businessId', 'name').sort({ assignedAt: -1 });
exports.my = async (req, res) => res.json(await pop(Assignment.find({ workerId: req.user._id, status: { $ne: 'cancelled' } })));
exports.all = async (req, res) => res.json(await pop(Assignment.find(req.user.role === 'admin' ? {} : { businessId: req.user._id })));
