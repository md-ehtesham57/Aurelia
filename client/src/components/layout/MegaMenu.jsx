import { Link } from 'react-router-dom';

const categories = [
  { name: 'Rings', slug: 'rings', image: '/placeholder.svg' },
  { name: 'Necklaces', slug: 'necklaces', image: '/placeholder.svg' },
  { name: 'Earrings', slug: 'earrings', image: '/placeholder.svg' },
  { name: 'Bangles & Bracelets', slug: 'bangles-bracelets', image: '/placeholder.svg' },
  { name: 'Pendants', slug: 'pendants', image: '/placeholder.svg' },
  { name: 'Mangalsutras', slug: 'mangalsutras', image: '/placeholder.svg' },
];

const MegaMenu = () => {
  return (
    <div className="absolute top-full left-0 w-full bg-surface border-t border-bg shadow-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-6 gap-6">
          {categories.map((cat) => (
            <Link key={cat.slug} to={`/products?category=${cat.slug}`} className="group/card">
              <div className="aspect-square bg-bg rounded overflow-hidden mb-3">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover/card:scale-105"
                />
              </div>
              <p className="text-sm font-medium text-center text-text group-hover/card:text-primary transition-colors">
                {cat.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MegaMenu;
