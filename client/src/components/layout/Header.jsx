import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Search, Heart, ShoppingBag, User, Menu, X } from 'lucide-react';
import MegaMenu from './MegaMenu';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { itemCount } = useSelector((state) => state.cart);
  const navigate = useNavigate();

  const hasAdminAccess = user?.role?.permissions?.some(
    (p) => p.startsWith('product:') || p.startsWith('order:'),
  );

  return (
    <header className="sticky top-0 z-40 bg-surface border-b border-bg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <button
            className="lg:hidden p-2 hover:bg-bg rounded"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link to="/" className="font-serif text-2xl tracking-wider text-text">
            AURELIA
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            <Link to="/products" className="text-sm text-text-muted hover:text-text transition-colors">
              All Jewelry
            </Link>
            <Link to="/products?category=rings" className="text-sm text-text-muted hover:text-text transition-colors">
              Rings
            </Link>
            <Link to="/products?category=necklaces" className="text-sm text-text-muted hover:text-text transition-colors">
              Necklaces
            </Link>
            <Link to="/products?category=earrings" className="text-sm text-text-muted hover:text-text transition-colors">
              Earrings
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-bg rounded transition-colors">
              <Search size={18} className="text-text-muted" />
            </button>
            <button className="p-2 hover:bg-bg rounded transition-colors">
              <Heart size={18} className="text-text-muted" />
            </button>
            <button
              onClick={() => navigate('/cart')}
              className="p-2 hover:bg-bg rounded transition-colors relative"
            >
              <ShoppingBag size={18} className="text-text-muted" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </button>
            <button
              onClick={() => navigate(isAuthenticated ? '/account' : '/login')}
              className="p-2 hover:bg-bg rounded transition-colors"
            >
              <User size={18} className="text-text-muted" />
            </button>
            {hasAdminAccess && (
              <Link
                to="/admin"
                className="text-xs text-primary hover:text-primary-dark transition-colors"
              >
                Admin
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className={`lg:hidden border-t border-bg transition-all duration-300 overflow-hidden ${mobileMenuOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}>
        <nav className="px-4 py-4 space-y-3">
          <Link to="/products" className="block text-sm text-text-muted hover:text-text" onClick={() => setMobileMenuOpen(false)}>All Jewelry</Link>
          <Link to="/products?category=rings" className="block text-sm text-text-muted hover:text-text" onClick={() => setMobileMenuOpen(false)}>Rings</Link>
          <Link to="/products?category=necklaces" className="block text-sm text-text-muted hover:text-text" onClick={() => setMobileMenuOpen(false)}>Necklaces</Link>
          <Link to="/products?category=earrings" className="block text-sm text-text-muted hover:text-text" onClick={() => setMobileMenuOpen(false)}>Earrings</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
