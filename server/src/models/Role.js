import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: String,
  permissions: [{ type: String }],
  isSystemRole: { type: Boolean, default: false },
}, { timestamps: true });

const Role = mongoose.model('Role', roleSchema);
export default Role;
