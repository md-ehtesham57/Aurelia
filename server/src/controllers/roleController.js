import Role from '../models/Role.js';
import { sendSuccess, AppError } from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getRoles = asyncHandler(async (_req, res) => {
  const roles = await Role.find().sort({ isSystemRole: -1 });
  sendSuccess(res, { roles });
});

export const createRole = asyncHandler(async (req, res) => {
  const role = await Role.create(req.validatedBody);
  sendSuccess(res, { role }, 'Role created', 201);
});

export const updateRolePermissions = asyncHandler(async (req, res) => {
  const { permissions } = req.body;

  const role = await Role.findById(req.params.id);
  if (!role) throw new AppError('Role not found', 404);

  if (role.isSystemRole) {
    role.permissions = permissions;
    await role.save();
  } else {
    role.permissions = permissions;
    await role.save();
  }

  sendSuccess(res, { role }, 'Permissions updated');
});
