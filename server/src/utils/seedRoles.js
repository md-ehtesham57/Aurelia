import Role from '../models/Role.js';

const defaultRoles = [
  {
    name: 'super_admin',
    description: 'Full control over the platform',
    permissions: [
      'product:create', 'product:read', 'product:update', 'product:delete',
      'product:publish', 'product:unpublish',
      'category:create', 'category:update', 'category:delete',
      'order:read', 'order:update_status', 'order:refund',
      'user:read', 'user:update_role', 'user:ban',
      'banner:create', 'banner:update',
      'discount:create', 'discount:update',
      'role:create', 'role:assign_permission',
      'content:moderate', 'content:manage',
      'settings:update',
    ],
    isSystemRole: true,
  },
  {
    name: 'product_manager',
    description: 'Manage products, categories, collections, stock, pricing',
    permissions: [
      'product:create', 'product:read', 'product:update', 'product:delete',
      'product:publish', 'product:unpublish',
      'category:create', 'category:update', 'category:delete',
    ],
    isSystemRole: true,
  },
  {
    name: 'order_manager',
    description: 'Manage orders, refunds, returns, shipping',
    permissions: [
      'order:read', 'order:update_status', 'order:refund',
    ],
    isSystemRole: true,
  },
  {
    name: 'content_manager',
    description: 'Manage banners, promotional content, blog pages',
    permissions: [
      'banner:create', 'banner:update',
      'content:moderate', 'content:manage',
    ],
    isSystemRole: true,
  },
  {
    name: 'support_agent',
    description: 'Read-only orders/users, respond to customer queries',
    permissions: [
      'order:read', 'user:read',
      'content:moderate',
    ],
    isSystemRole: true,
  },
  {
    name: 'customer',
    description: 'Default role for registered customers',
    permissions: [],
    isSystemRole: true,
  },
];

export const seedRoles = async () => {
  for (const roleData of defaultRoles) {
    await Role.findOneAndUpdate(
      { name: roleData.name },
      roleData,
      { upsert: true, new: true },
    );
  }
  console.log('Default roles seeded');
};
