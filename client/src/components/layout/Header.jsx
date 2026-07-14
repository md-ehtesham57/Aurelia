import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown } from 'lucide-react';
import { useGetWishlistQuery } from '../../features/auth/authApi';
import { useGetCartQuery } from '../../features/cart/cartApi';
import MegaMenu from './MegaMenu';

const NAV_LINKS = [
  { label: 'Rings', category: 'rings' },
  { label: 'Necklaces', category: 'necklaces' },
  { label: 'Earrings', category: 'earrings' },
];

const CountBadge = ({ count }) => {
  if (!count) return null;
  return (
    <span className="absolute -top-0.5 -right-0.5 bg-primary text-white text-[10px] leading-none font-medium w-4 h-4 flex items-center justify-center rounded-full">
      {count > 9 ? '9+' : count}
    </span>
  );
};

const IconButton = ({ onClick, label, children, badgeCount, className = '' }) => (
  <button
    onClick={onClick}
    aria-label={label}
    className={`relative p-2 sm:p-2.5 rounded-full text-text-muted hover:text-text hover:bg-bg
                transition-all duration-200 hover:scale-105 active:scale-95
                focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${className}`}
  >
    {children}
    <CountBadge count={badgeCount} />
  </button>
);

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [shopMenuOpen, setShopMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const searchRef = useRef(null);
  const searchContainerRef = useRef(null);
  const shopMenuRef = useRef(null);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { itemCount } = useSelector((state) => state.cart);
  useGetCartQuery();
  const { data: wishlistData } = useGetWishlistQuery(undefined, { skip: !isAuthenticated });
  const wishlistCount = wishlistData?.data?.wishlist?.length || 0;
  const navigate = useNavigate();

  const hasAdminAccess = user?.role?.permissions?.some(
    (p) => p.startsWith('product:') || p.startsWith('order:'),
  );

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchOpen]);

  // Shop mega menu: close on outside click or Escape, independent of any hover CSS
  useEffect(() => {
    if (!shopMenuOpen) return;
    const handleClickOutside = (e) => {
      if (shopMenuRef.current && !shopMenuRef.current.contains(e.target)) {
        setShopMenuOpen(false);
      }
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') setShopMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [shopMenuOpen]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleMobileSearch = (e) => {
    e.preventDefault();
    if (mobileSearchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(mobileSearchQuery.trim())}`);
      setMobileMenuOpen(false);
      setMobileSearchQuery('');
    }
  };

  const toggleSearch = () => {
    setSearchOpen((open) => !open);
    if (searchOpen) setSearchQuery('');
  };

  return (
    <header className="sticky top-0 z-40">
      <div
        className={`backdrop-blur-md transition-all duration-300
                    ${isScrolled
            ? 'bg-surface/90 border-b border-surface shadow-[0_4px_20px_-8px_rgba(43,38,32,0.12)]'
            : 'bg-surface/70 border-b border-transparent'}`}
      >
        <div className="max-w-7xl mx-auto px-fluid-4">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center h-16 sm:h-20">
            {/* Left: mobile trigger + desktop nav */}
            <div className="flex items-center gap-fluid-6">
              <button
                className="lg:hidden p-2 -ml-2 rounded-full hover:bg-bg transition-colors
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                onClick={() => setMobileMenuOpen((open) => !open)}
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

              <nav className="hidden lg:flex items-center gap-fluid-6">
                <div ref={shopMenuRef}>
                  <button
                    onClick={() => setShopMenuOpen((open) => !open)}
                    aria-expanded={shopMenuOpen}
                    className="flex items-center gap-1 text-sm text-text-muted hover:text-text transition-colors"
                  >
                    Shop
                    <ChevronDown size={14} className={`transition-transform duration-200 ${shopMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* FIX: Using short-circuit evaluation guarantees the MegaMenu DOM elements don't layout or register height when closed */}
                  {shopMenuOpen && (
                    <MegaMenu isOpen={shopMenuOpen} onNavigate={() => setShopMenuOpen(false)} />
                  )}
                </div>
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.category}
                    to={`/products?category=${link.category}`}
                    className="relative text-sm text-text-muted hover:text-text transition-colors
                             after:absolute after:left-0 after:-bottom-1 after:h-px after:w-0 after:bg-primary
                             after:transition-all after:duration-300 hover:after:w-full"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Center: logo */}
            <Link to="/" className="font-serif text-xl sm:text-2xl tracking-[0.15em] text-text whitespace-nowrap">
              AURELIA
            </Link>

            {/* Right: mobile shows cart only, desktop shows the full action cluster */}
            <div className="flex items-center justify-end gap-0.5 sm:gap-1">
              <div className="relative hidden sm:block" ref={searchContainerRef}>
                <IconButton onClick={toggleSearch} label="Search products">
                  <Search size={18} />
                </IconButton>
                {searchOpen && (
                  <form
                    onSubmit={handleSearch}
                    className="absolute right-0 top-full mt-2 w-72 bg-surface/95 backdrop-blur-md border border-surface
                             rounded-xl shadow-[0_12px_32px_-8px_rgba(43,38,32,0.18)] overflow-hidden flex"
                  >
                    <input
                      ref={searchRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="flex-1 px-4 py-2.5 text-sm bg-transparent focus:outline-none"
                    />
                    <button
                      type="submit"
                      aria-label="Submit search"
                      className="px-4 py-2.5 bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
                    >
                      Go
                    </button>
                  </form>
                )}
              </div>

              <IconButton
                onClick={() => navigate(isAuthenticated ? '/account?tab=wishlist' : '/login')}
                label="Wishlist"
                badgeCount={wishlistCount}
                className="hidden sm:inline-flex"
              >
                <Heart size={18} className={wishlistCount > 0 ? 'fill-primary text-primary' : ''} />
              </IconButton>

              <IconButton onClick={() => navigate('/cart')} label="Shopping bag" badgeCount={itemCount}>
                <ShoppingBag size={18} />
              </IconButton>

              <IconButton
                onClick={() => navigate(isAuthenticated ? '/account' : '/login')}
                label={isAuthenticated ? 'Your account' : 'Sign in'}
                className="hidden sm:inline-flex"
              >
                <User size={18} />
              </IconButton>

              {hasAdminAccess && (
                <Link
                  to="/admin"
                  className="hidden sm:inline-flex items-center ml-1 px-3 py-1.5 rounded-full text-xs font-medium
                           text-primary border border-primary/30 hover:bg-primary hover:text-white transition-colors"
                >
                  Admin
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile panel container layout */}
        <div
          className={`lg:hidden border-t transition-all duration-300 overflow-hidden
                    ${mobileMenuOpen ? 'max-h-[32rem] opacity-100 border-surface' : 'max-h-0 opacity-0 border-transparent pointer-events-none'}`}
        >
          <div className="px-fluid-4 py-fluid-4 space-y-4">
            <form onSubmit={handleMobileSearch} className="flex bg-bg rounded-full overflow-hidden">
              <input
                type="text"
                value={mobileSearchQuery}
                onChange={(e) => setMobileSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 px-4 py-2.5 text-sm bg-transparent focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Submit search"
                className="px-4 flex items-center justify-center text-text-muted hover:text-primary transition-colors"
              >
                <Search size={18} />
              </button>
            </form>

            <nav className="space-y-1">
              <Link
                to="/products"
                className="block px-2 py-2.5 rounded-lg text-sm text-text-muted hover:text-text hover:bg-bg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                All Jewelry
              </Link>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.category}
                  to={`/products?category=${link.category}`}
                  className="block px-2 py-2.5 rounded-lg text-sm text-text-muted hover:text-text hover:bg-bg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="border-t border-surface pt-3 space-y-1">
              <Link
                to={isAuthenticated ? '/account?tab=wishlist' : '/login'}
                className="flex items-center justify-between px-2 py-2.5 rounded-lg text-sm text-text-muted hover:text-text hover:bg-bg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="flex items-center gap-2">
                  <Heart size={16} className={wishlistCount > 0 ? 'fill-primary text-primary' : ''} />
                  Wishlist
                </span>
                {wishlistCount > 0 && <span className="text-xs text-text-muted">{wishlistCount}</span>}
              </Link>
              <Link
                to={isAuthenticated ? '/account' : '/login'}
                className="flex items-center gap-2 px-2 py-2.5 rounded-lg text-sm text-text-muted hover:text-text hover:bg-bg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <User size={16} />
                {isAuthenticated ? 'Your Account' : 'Sign In'}
              </Link>
              {hasAdminAccess && (
                <Link
                  to="/admin"
                  className="block px-2 py-2.5 rounded-lg text-sm text-primary hover:bg-bg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;