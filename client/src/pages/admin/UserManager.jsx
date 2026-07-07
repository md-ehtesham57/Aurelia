import { useGetUsersQuery, useUpdateUserRoleMutation } from '../../features/admin/adminApi';
import { useGetRolesQuery } from '../../features/admin/adminApi';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

const UserManager = () => {
  const { data: usersData, isLoading } = useGetUsersQuery();
  const { data: rolesData } = useGetRolesQuery();
  const [updateRole] = useUpdateUserRoleMutation();

  const users = usersData?.data?.users || [];
  const roles = rolesData?.data?.roles || [];

  const handleRoleChange = async (userId, roleId) => {
    try {
      await updateRole({ id: userId, roleId }).unwrap();
      toast.success('User role updated');
    } catch {
      toast.error('Failed to update role');
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div>
      <div className="bg-surface rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-bg text-left">
              <th className="p-4 font-medium text-text-muted">Name</th>
              <th className="p-4 font-medium text-text-muted">Email</th>
              <th className="p-4 font-medium text-text-muted">Role</th>
              <th className="p-4 font-medium text-text-muted">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b border-bg/50 hover:bg-bg/50 transition-colors">
                <td className="p-4 font-medium">{user.name}</td>
                <td className="p-4 text-text-muted">{user.email}</td>
                <td className="p-4">
                  <select
                    value={user.role?._id || ''}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="text-xs bg-transparent border border-bg rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {roles.map((role) => (
                      <option key={role._id} value={role._id}>{role.name}</option>
                    ))}
                  </select>
                </td>
                <td className="p-4">
                  <span className={`text-xs ${user.isBanned ? 'text-error' : 'text-success'}`}>
                    {user.isBanned ? 'Banned' : 'Active'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <p className="p-8 text-center text-text-muted">No users found</p>
        )}
      </div>
    </div>
  );
};

export default UserManager;
