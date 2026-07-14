import { Link } from 'react-router-dom';

const categories = [
  { name: 'Rings', slug: 'rings', image: '/placeholder.svg' },
  { name: 'Necklaces', slug: 'necklaces', image: '/placeholder.svg' },
  { name: 'Earrings', slug: 'earrings', image: '/placeholder.svg' },
  { name: 'Bangles & Bracelets', slug: 'bangles-bracelets', image: '/placeholder.svg' },
  { name: 'Pendants', slug: 'pendants', image: '/placeholder.svg' },
  { name: 'Mangalsutras', slug: 'mangalsutras', image: '/placeholder.svg' },
];

const MegaMenu = ({ isOpen, onNavigate }) => {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onNavigate();
    }
  };

  return (
    <div 
      onClick={handleBackdropClick} 
      className={`fixed inset-x-0 top-16 sm:top-20 bg-transparent transition-all duration-200 z-50
                  ${isOpen 
                    ? 'opacity-100 visible translate-y-0 pointer-events-auto' 
                    : 'opacity-0 invisible -translate-y-1 pointer-events-none'}`}
    >
      {/* 
        GLASSMORPHISM CONTAINER: 
        - bg-surface/40: Low-opacity background transparency
        - backdrop-blur-md: Native frosted glass effect
        - border border-white/20: Highlights crisp glass edge lines
        - shadow-[0_16px_32px_rgba(0,0,0,0.08)]: Balanced float look
      */}
      <div 
        onClick={handleBackdropClick} 
        className="max-w-3xl mx-auto px-4 py-4 mt-2 rounded-2xl
                   bg-surface/40 backdrop-blur-md border border-white/20 
                   shadow-[0_16px_32px_-8px_rgba(43,38,32,0.15)]"
      > 
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/products?category=${cat.slug}`}
              className="group/card"
              onClick={onNavigate}
            >
              {/* Inherits glass behavior transparently, keeping image cards clean and tiny */}
              <div className="bg-surface/60 border border-white/10 shadow-sm rounded-xl p-2 transition-all duration-300 group-hover/card:bg-surface/90 group-hover/card:shadow-md group-hover/card:-translate-y-0.5">
                <div className="aspect-square bg-bg rounded-lg overflow-hidden mb-1.5">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover/card:scale-105"
                  />
                </div>
                <p className="text-[11px] sm:text-xs font-medium text-center text-text group-hover/card:text-primary transition-colors truncate">
                  {cat.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;