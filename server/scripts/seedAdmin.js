require('dotenv').config();
const mongoose = require('mongoose'), User = require('../models/User');
(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const email = (process.env.ADMIN_EMAIL || '').toLowerCase();
  if (!email || !process.env.ADMIN_PASSWORD) { console.log('Set ADMIN_EMAIL and ADMIN_PASSWORD in .env'); process.exit(1); }
  if (await User.findOne({ email })) console.log('Admin already exists');
  else { await User.create({ name: 'Platform Admin', email, phone: '0000000000', password: process.env.ADMIN_PASSWORD, role: 'admin' }); console.log('Admin created: ' + email); }
  process.exit(0);
})();
