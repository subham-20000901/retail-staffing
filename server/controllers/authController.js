const User = require('../models/User'), gen = require('../utils/generateToken');
const out = u => ({ _id: u._id, name: u.name, email: u.email, phone: u.phone, role: u.role, status: u.status, skills: u.skills, experience: u.experience, preferredRole: u.preferredRole });
exports.register = async (req, res) => {
  const { name, email, phone, password, role } = req.body;
  if (!name || !email || !phone || !password) return res.status(400).json({ message: 'Name, email, phone and password are required' });
  if (!['business', 'worker'].includes(role)) return res.status(400).json({ message: 'Choose Business or Worker' });
  if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
  if (await User.findOne({ email: email.toLowerCase() })) return res.status(409).json({ message: 'This email is already registered' });
  const user = await User.create({ name, email, phone, password, role });
  res.status(201).json({ token: gen(user._id), user: out(user) });
};
exports.login = async (req, res) => {
  const user = await User.findOne({ email: (req.body.email || '').toLowerCase() }).select('+password');
  if (!user || !(await user.matchPassword(req.body.password || ''))) return res.status(401).json({ message: 'Wrong email or password' });
  if (user.status === 'blocked') return res.status(403).json({ message: 'This account is blocked' });
  res.json({ token: gen(user._id), user: out(user) });
};
exports.me = (req, res) => res.json(out(req.user));
exports.updateMe = async (req, res) => {
  const { name, phone, experience, preferredRole, skills } = req.body;
  Object.assign(req.user, { ...(name && { name }), ...(phone && { phone }), ...(experience !== undefined && { experience }), ...(preferredRole !== undefined && { preferredRole }) });
  if (skills !== undefined) req.user.skills = (Array.isArray(skills) ? skills : String(skills).split(',')).map(x => x.trim()).filter(Boolean);
  await req.user.save(); res.json(out(req.user));
};
