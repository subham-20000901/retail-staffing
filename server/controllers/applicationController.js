const Application = require('../models/Application'), Assignment = require('../models/Assignment'), Job = require('../models/Job');
exports.my = async (req, res) => res.json(await Application.find({ workerId: req.user._id }).populate('jobId').sort({ appliedAt: -1 }));
exports.forJob = async (req, res) => {
  const job = await Job.findById(req.params.jobId);
  if (!job) return res.status(404).json({ message: 'Job not found' });
  if (req.user.role === 'business' && String(job.businessId) !== String(req.user._id)) return res.status(403).json({ message: 'Not your job' });
  res.json(await Application.find({ jobId: job._id }).populate('workerId', 'name email phone skills experience preferredRole').sort({ appliedAt: 1 }));
};
const load = async (req, res) => {
  const app = await Application.findById(req.params.id).populate('jobId');
  if (!app) { res.status(404).json({ message: 'Application not found' }); return null; }
  if (req.user.role === 'business' && String(app.jobId.businessId) !== String(req.user._id)) { res.status(403).json({ message: 'Not your job' }); return null; }
  if (app.status !== 'pending') { res.status(400).json({ message: 'This application was already ' + app.status }); return null; }
  return app;
};
exports.approve = async (req, res) => {
  const app = await load(req, res); if (!app) return;
  const job = app.jobId;
  if (job.status !== 'open') return res.status(400).json({ message: 'This job is not open any more' });
  const taken = await Assignment.countDocuments({ jobId: job._id, status: { $ne: 'cancelled' } });
  if (taken >= job.workersRequired) return res.status(400).json({ message: 'All positions are already filled' });
  await Assignment.create({ jobId: job._id, workerId: app.workerId, businessId: job.businessId });
  app.status = 'approved'; await app.save();
  if (taken + 1 >= job.workersRequired) { job.status = 'filled'; await job.save(); }
  res.json({ message: 'Worker approved', status: 'approved' });
};
exports.reject = async (req, res) => {
  const app = await load(req, res); if (!app) return;
  app.status = 'rejected'; await app.save(); res.json({ message: 'Worker rejected', status: 'rejected' });
};
