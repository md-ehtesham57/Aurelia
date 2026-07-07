import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import Role from '../models/Role.js';
import { sendSuccess, sendError, AppError } from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendPasswordReset, sendWelcomeEmail } from '../services/emailService.js';

const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '15m',
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
  });
};

const setRefreshTokenCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.validatedBody;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('Email already registered', 409);
  }

  const customerRole = await Role.findOne({ name: 'customer' });
  if (!customerRole) {
    throw new AppError('Default role not found', 500);
  }

  const user = await User.create({
    name,
    email,
    passwordHash: password,
    role: customerRole._id,
  });

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  setRefreshTokenCookie(res, refreshToken);

  sendWelcomeEmail(user).catch(() => {});

  sendSuccess(res, {
    user: user.toJSON(),
    accessToken,
  }, 'Registration successful', 201);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.validatedBody;

  const user = await User.findOne({ email }).populate('role');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }

  if (user.isBanned) {
    throw new AppError('Account is banned', 403);
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  setRefreshTokenCookie(res, refreshToken);

  sendSuccess(res, {
    user: user.toJSON(),
    accessToken,
  }, 'Login successful');
});

export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken: token } = req.cookies;
  if (!token) {
    throw new AppError('No refresh token', 401);
  }

  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  const user = await User.findById(decoded.id).populate('role');
  if (!user || user.isBanned) {
    throw new AppError('Invalid token', 401);
  }

  const accessToken = generateAccessToken(user._id);
  const newRefreshToken = generateRefreshToken(user._id);
  setRefreshTokenCookie(res, newRefreshToken);

  sendSuccess(res, { user: user.toJSON(), accessToken });
});

export const logout = asyncHandler(async (_req, res) => {
  res.clearCookie('refreshToken');
  sendSuccess(res, null, 'Logged out');
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.validatedBody;
  const user = await User.findOne({ email });
  if (!user) {
    sendSuccess(res, null, 'If the email exists, a reset link has been sent.');
    return;
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpire = Date.now() + 3600000;
  await user.save();

  sendPasswordReset(user, resetToken).catch(() => {});

  sendSuccess(res, null, 'If the email exists, a reset link has been sent.');
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.validatedBody;

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new AppError('Invalid or expired token', 400);
  }

  user.passwordHash = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendSuccess(res, null, 'Password reset successful');
});
