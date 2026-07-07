import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import User from '../models/User.js';
import Role from '../models/Role.js';

const email = process.argv[2] || 'admin@aurelia.com';
const password = process.argv[3] || 'admin123!';

const seedAdmin = async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  const superAdminRole = await Role.findOne({ name: 'super_admin' });
  if (!superAdminRole) {
    console.log('Roles not seeded yet. Run the server first to seed roles.');
    process.exit(1);
  }

  const existing = await User.findOne({ email });
  if (existing) {
    existing.role = superAdminRole._id;
    await existing.save();
    console.log(`Admin role assigned to existing user: ${email}`);
  } else {
    await User.create({
      name: 'Admin',
      email,
      passwordHash: password,
      role: superAdminRole._id,
      isVerified: true,
    });
    console.log(`Admin user created: ${email} / ${password}`);
  }

  await mongoose.disconnect();
};

seedAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
