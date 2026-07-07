import User from '../models/User.js';
import Role from '../models/Role.js';
import { sendSuccess, AppError } from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('role', 'name permissions');
  sendSuccess(res, { user: user.toJSON() });
});

export const updateMe = asyncHandler(async (req, res) => {
  const { name, phone, addresses } = req.body;
  const updates = {};
  if (name) updates.name = name;
  if (phone) updates.phone = phone;
  if (addresses) updates.addresses = addresses;

  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
  sendSuccess(res, { user: user.toJSON() }, 'Profile updated');
});

export const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const user = await User.findById(req.user._id);

  if (user.wishlist.includes(productId)) {
    user.wishlist.pull(productId);
  } else {
    user.wishlist.push(productId);
  }
  await user.save();

  sendSuccess(res, { wishlist: user.wishlist });
});

export const getUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const [users, total] = await Promise.all([
    User.find().populate('role', 'name').select('-passwordHash').skip(skip).limit(Number(limit)),
    User.countDocuments(),
  ]);

  sendSuccess(res, {
    users,
    pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
  });
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const { roleId } = req.body;
  const role = await Role.findById(roleId);
  if (!role) throw new AppError('Role not found', 404);

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role: roleId },
    { new: true },
  ).populate('role', 'name');

  if (!user) throw new AppError('User not found', 404);
  sendSuccess(res, { user: user.toJSON() }, 'User role updated');
});

export const banUser = asyncHandler(async (req, res) => {
  const { isBanned } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isBanned },
    { new: true },
  );
  if (!user) throw new AppError('User not found', 404);
  sendSuccess(res, null, isBanned ? 'User banned' : 'User unbanned');
});
