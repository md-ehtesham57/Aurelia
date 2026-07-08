import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingCart, Tags, Users, Shield,
  Percent, Image, DollarSign, MessageSquare, Menu, X, LogOut,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const sidebarLinks = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/admin/products', icon: Package, label: 'Products' },
  { to: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  { to: '/admin/categories', icon: Tags, label: 'Categories' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/roles', icon: Shield, label: 'Roles' },
  { to: '/admin/coupons', icon: Percent, label: 'Coupons' },
  { to: '/admin/banners', icon: Image, label: 'Banners' },
  { to: '/admin/gold-rate', icon: DollarSign, label: 'Gold Rate' },
  { to: '/admin/reviews', icon: MessageSquare, label: 'Reviews' },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-bg flex">
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-bg transform transition-transform duration-200 lg:relative lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-bg">
          <Link to="/admin" className="font-serif text-lg">Aurelia Admin</Link>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = link.exact ? pathname === link.to : pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded transition-colors ${
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-text-muted hover:text-text hover:bg-bg'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <link.icon size={18} />
                {link.label}
              </Link>
            );
          })}
          <hr className="my-3 border-bg" />
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2.5 text-sm text-text-muted hover:text-text hover:bg-bg rounded transition-colors"
          >
            <Package size={18} />
            Storefront
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 text-sm text-error hover:bg-error/5 rounded transition-colors w-full"
          >
            <LogOut size={18} />
            Logout
          </button>
        </nav>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 bg-surface border-b border-bg h-16 flex items-center px-4 lg:px-8">
          <button className="lg:hidden mr-4" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <h2 className="font-serif text-lg">
            {sidebarLinks.find((l) => l.exact ? pathname === l.to : pathname.startsWith(l.to))?.label || 'Dashboard'}
          </h2>
        </header>
        <div className="p-4 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
