const User = require('../models/User'), Job = require('../models/Job'), Application = require('../models/Application'), Assignment = require('../models/Assignment');
module.exports = async (req, res) => {
  const u = req.user;
  if (u.role === 'business') {
    const ids = (await Job.find({ businessId: u._id }).select('_id')).map(j => j._id);
    const [activeJobs, totalApplications, assignedWorkers, pendingApplications] = await Promise.all([
      Job.countDocuments({ businessId: u._id, status: 'open' }), Application.countDocuments({ jobId: { $in: ids } }),
      Assignment.countDocuments({ businessId: u._id, status: { $ne: 'cancelled' } }), Application.countDocuments({ jobId: { $in: ids }, status: 'pending' })]);
    return res.json({ activeJobs, totalApplications, assignedWorkers, pendingApplications });
  }
  if (u.role === 'worker') {
    const [availableJobs, appliedJobs, upcomingJobs, completedJobs] = await Promise.all([
      Job.countDocuments({ status: 'open' }), Application.countDocuments({ workerId: u._id }),
      Assignment.countDocuments({ workerId: u._id, status: { $in: ['assigned', 'active'] } }), Assignment.countDocuments({ workerId: u._id, status: 'completed' })]);
    return res.json({ availableJobs, appliedJobs, upcomingJobs, completedJobs });
  }
  const [totalBusinesses, totalWorkers, openJobs, pendingApplications, recent] = await Promise.all([
    User.countDocuments({ role: 'business' }), User.countDocuments({ role: 'worker' }), Job.countDocuments({ status: 'open' }),
    Application.countDocuments({ status: 'pending' }), Job.find().sort({ createdAt: -1 }).limit(5).populate('businessId', 'name')]);
  res.json({ totalBusinesses, totalWorkers, openJobs, pendingApplications, recent });
};
