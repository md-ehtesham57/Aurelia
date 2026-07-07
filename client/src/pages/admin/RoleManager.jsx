import { useState } from 'react';
import { useGetRolesQuery, useUpdateRolePermissionsMutation, useCreateRoleMutation } from '../../features/admin/adminApi';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';

const allPermissions = [
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
];

const RoleManager = () => {
  const { data, isLoading } = useGetRolesQuery();
  const [updatePermissions] = useUpdateRolePermissionsMutation();
  const [createRole] = useCreateRoleMutation();
  const [editRole, setEditRole] = useState(null);

  const roles = data?.data?.roles || [];

  const togglePermission = async (roleId, permission) => {
    const role = roles.find((r) => r._id === roleId);
    if (!role) return;

    const updated = role.permissions.includes(permission)
      ? role.permissions.filter((p) => p !== permission)
      : [...role.permissions, permission];

    try {
      await updatePermissions({ id: roleId, permissions: updated }).unwrap();
      toast.success('Permissions updated');
    } catch {
      toast.error('Failed to update permissions');
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h3 className="font-serif text-base sm:text-lg">Roles & Permissions</h3>
        <Button size="sm" className="w-full sm:w-auto" onClick={() => setEditRole({ name: '', permissions: [] })}>Create Role</Button>
      </div>

      <div className="space-y-4">
        {roles.map((role) => (
          <div key={role._id} className="bg-surface rounded p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
              <div>
                <h4 className="font-medium capitalize text-sm sm:text-base">{role.name.replace(/_/g, ' ')}</h4>
                {role.description && <p className="text-xs text-text-muted">{role.description}</p>}
              </div>
              {role.isSystemRole && (
                <span className="text-xs text-text-muted bg-bg px-2 py-1 rounded self-start sm:self-auto">System</span>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {allPermissions.map((perm) => (
                <button
                  key={perm}
                  onClick={() => togglePermission(role._id, perm)}
                  className={`text-[10px] sm:text-xs px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded border transition-colors ${
                    role.permissions.includes(perm)
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'border-bg text-text-muted hover:border-primary/30'
                  }`}
                >
                  {perm}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoleManager;
