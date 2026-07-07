import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const hasAdminAccess = user.role?.permissions?.some(
    (p) => p.startsWith('product:') || p.startsWith('order:') || p.startsWith('user:') || p.startsWith('role:'),
  );

  if (!hasAdminAccess && user.role?.name !== 'super_admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
