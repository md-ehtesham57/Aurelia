import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Search, Heart, ShoppingBag, User, Menu, X } from 'lucide-react';
import { useGetWishlistQuery } from '../../features/auth/authApi';
import { useGetCartQuery } from '../../features/cart/cartApi';
import MegaMenu from './MegaMenu';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef(null);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { itemCount } = useSelector((state) => state.cart);
  useGetCartQuery();
  const { data: wishlistData } = useGetWishlistQuery(undefined, { skip: !isAuthenticated });
  const wishlistCount = wishlistData?.data?.wishlist?.length || 0;
  const navigate = useNavigate();

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (searchOpen) setSearchQuery('');
  };

  const hasAdminAccess = user?.role?.permissions?.some(
    (p) => p.startsWith('product:') || p.startsWith('order:'),
  );

  return (
    <header className="sticky top-0 z-40 bg-surface border-b border-bg overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <button
            className="lg:hidden p-2 hover:bg-bg rounded"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link to="/" className="font-serif text-xl sm:text-2xl tracking-wider text-text">
            AURELIA
          </Link>

          <nav className="hidden lg:flex items-center gap-fluid-8">
            <div className="group relative">
              <button className="text-sm text-text-muted hover:text-text transition-colors cursor-default">
                Shop
              </button>
              <MegaMenu />
            </div>
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

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative">
              <button onClick={toggleSearch} className="p-2 hover:bg-bg rounded transition-colors">
                <Search size={18} className="text-text-muted" />
              </button>
              {searchOpen && (
                <form onSubmit={handleSearch} className="absolute right-0 top-full mt-2 w-72 bg-surface border border-bg rounded shadow-sm overflow-hidden flex">
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="flex-1 px-4 py-2.5 text-sm bg-transparent focus:outline-none"
                  />
                  <button type="submit" className="px-3 py-2.5 bg-primary text-white text-sm hover:bg-primary-dark transition-colors">
                    Go
                  </button>
                </form>
              )}
            </div>
            <Link to={isAuthenticated ? '/account?tab=wishlist' : '/login'} className="p-2 hover:bg-bg rounded transition-colors relative">
              <Heart size={18} className={`${wishlistCount > 0 ? 'fill-primary text-primary' : 'text-text-muted'}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>
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
                className="hidden sm:inline text-xs text-primary hover:text-primary-dark transition-colors"
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
