import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { getCloudinary } from '../config/cloudinary.js';
import { sendSuccess, AppError } from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError('No file uploaded', 400);
  }

  const cloudinary = getCloudinary();

  if (cloudinary) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'aurelia-jewels',
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    });
    fs.unlink(req.file.path, () => {});
    return sendSuccess(res, {
      url: result.secure_url,
      publicId: result.public_id,
    }, 'Image uploaded', 201);
  }

  const url = `/uploads/${req.file.filename}`;
  sendSuccess(res, { url, publicId: req.file.filename }, 'Image uploaded (local)', 201);
});

export const deleteImage = asyncHandler(async (req, res) => {
  const cloudinary = getCloudinary();
  if (cloudinary) {
    await cloudinary.uploader.destroy(req.params.publicId);
  } else {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const filePath = path.join(__dirname, '../../uploads', req.params.publicId);
    fs.unlink(filePath, () => {});
  }
  sendSuccess(res, null, 'Image deleted');
});
