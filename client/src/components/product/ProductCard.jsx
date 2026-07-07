import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import Badge from '../common/Badge';

const ProductCard = ({ product }) => {
  const { title, slug, images, metal, weightGrams, basePriceOverride, status, isNewArrival, isBestSeller } = product;
  const image = images?.[0]?.url || '/placeholder.svg';

  return (
    <Link to={`/products/${slug}`} className="group">
      <div className="bg-surface rounded overflow-hidden border border-bg/50 transition-all duration-300 hover:shadow-sm">
        <div className="relative aspect-square overflow-hidden bg-bg">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <button
            onClick={(e) => { e.preventDefault(); }}
            className="absolute top-3 right-3 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
          >
            <Heart size={18} className="text-text-muted hover:text-primary" />
          </button>
          {isNewArrival && <Badge variant="accent" className="absolute top-3 left-3">New</Badge>}
          {isBestSeller && <Badge variant="primary" className="absolute top-3 left-3">Best Seller</Badge>}
        </div>
        <div className="p-4 space-y-1">
          <h3 className="font-serif text-lg font-medium text-text group-hover:text-primary transition-colors">
            {title}
          </h3>
          {metal?.purity && (
            <p className="text-sm text-text-muted">{metal.purity} {metal.type}</p>
          )}
          <p className="font-medium text-primary">
            {basePriceOverride
              ? `₹${basePriceOverride.toLocaleString('en-IN')}`
              : `₹${(basePriceOverride || 0).toLocaleString('en-IN')}`}
          </p>
          {weightGrams && <p className="text-xs text-text-muted">{weightGrams}g</p>}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
