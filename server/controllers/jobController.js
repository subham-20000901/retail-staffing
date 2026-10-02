const Job = require('../models/Job'), Application = require('../models/Application'), Assignment = require('../models/Assignment');
const F = ['title', 'storeName', 'location', 'staffType', 'workersRequired', 'date', 'startTime', 'endTime', 'payRate', 'requirements'];
const pick = b => Object.fromEntries(F.filter(k => b[k] !== undefined).map(k => [k, b[k]]));
const today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
exports.create = async (req, res) => res.status(201).json(await Job.create({ ...pick(req.body), businessId: req.user._id }));
exports.list = async (req, res) => {
  const q = req.user.role === 'admin' ? {} : { status: 'open', date: { $gte: today() } };
  res.json(await Job.find(q).populate('businessId', 'name').sort({ date: 1 }));
};
exports.my = async (req, res) => {
  const jobs = await Job.find({ businessId: req.user._id }).sort({ createdAt: -1 }).lean();
  const counts = await Application.aggregate([{ $match: { jobId: { $in: jobs.map(j => j._id) } } },
    { $group: { _id: '$jobId', total: { $sum: 1 }, pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } }, approved: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } } } }]);
  const m = Object.fromEntries(counts.map(c => [String(c._id), c]));
  res.json(jobs.map(j => ({ ...j, applicants: m[String(j._id)]?.total || 0, pendingCount: m[String(j._id)]?.pending || 0, approvedCount: m[String(j._id)]?.approved || 0 })));
};
exports.getOne = async (req, res) => {
  const job = await Job.findById(req.params.id).populate('businessId', 'name phone email');
  if (!job) return res.status(404).json({ message: 'Job not found' });
  if (req.user.role === 'business' && String(job.businessId._id) !== String(req.user._id)) return res.status(403).json({ message: 'Not your job' });
  const myApplication = req.user.role === 'worker' ? await Application.findOne({ jobId: job._id, workerId: req.user._id }) : null;
  res.json({ job, myApplication });
};
const own = async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) { res.status(404).json({ message: 'Job not found' }); return null; }
  if (String(job.businessId) !== String(req.user._id)) { res.status(403).json({ message: 'Not your job' }); return null; }
  return job;
};
exports.update = async (req, res) => {
  const job = await own(req, res); if (!job) return;
  if (['cancelled', 'completed'].includes(job.status)) return res.status(400).json({ message: 'This job can no longer be edited' });
  Object.assign(job, pick(req.body)); await job.save(); res.json(job);
};
exports.cancel = async (req, res) => {
  const job = await own(req, res); if (!job) return;
  job.status = 'cancelled'; await job.save();
  await Application.updateMany({ jobId: job._id, status: 'pending' }, { status: 'rejected' });
  await Assignment.updateMany({ jobId: job._id }, { status: 'cancelled' });
  res.json(job);
};
exports.apply = async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: 'Job not found' });
  if (job.status !== 'open') return res.status(400).json({ message: 'This job is no longer open' });
  if (job.date < today()) return res.status(400).json({ message: 'This job date has passed' });
  try { res.status(201).json(await Application.create({ jobId: job._id, workerId: req.user._id })); }
  catch (e) { if (e.code === 11000) return res.status(409).json({ message: 'You already applied to this job' }); throw e; }
};
