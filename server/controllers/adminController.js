const User = require('../models/User'), Job = require('../models/Job'), Application = require('../models/Application'), Assignment = require('../models/Assignment');
exports.users = async (req, res) => res.json(await User.find().sort({ createdAt: -1 }));
exports.byRole = role => async (req, res) => res.json(await User.find({ role }).sort({ createdAt: -1 }));
exports.jobs = async (req, res) => res.json(await Job.find().populate('businessId', 'name').sort({ createdAt: -1 }));
exports.applications = async (req, res) => res.json(await Application.find().populate('workerId', 'name email').populate('jobId', 'title storeName').sort({ appliedAt: -1 }));
exports.assignments = async (req, res) => res.json(await Assignment.find().populate('workerId', 'name').populate('businessId', 'name').populate('jobId', 'title date').sort({ assignedAt: -1 }));
exports.setStatus = async (req, res) => {
  if (!['approved', 'blocked'].includes(req.body.status)) return res.status(400).json({ message: 'Invalid status' });
  const u = await User.findById(req.params.id);
  if (!u || u.role === 'admin') return res.status(404).json({ message: 'User not found' });
  u.status = req.body.status; await u.save(); res.json(u);
};
