import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import Badge from '../common/Badge';
import { useAuth } from '../../hooks/useAuth';
import { useToggleWishlistMutation, useGetWishlistQuery } from '../../features/auth/authApi';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { isAuthenticated } = useAuth();
  const { data: wishlistData } = useGetWishlistQuery(undefined, { skip: !isAuthenticated });
  const [toggleWishlist] = useToggleWishlistMutation();
  const wishlistIds = wishlistData?.data?.wishlist?.map((p) => p._id || p) || [];
  const isWishlisted = wishlistIds.includes(product._id);

  const { title, slug, images, metal, weightGrams, basePriceOverride, priceBreakdown, isNewArrival, isBestSeller } = product;
  const displayPrice = priceBreakdown?.total || basePriceOverride || 0;
  const image = images?.[0]?.url || '/placeholder.svg';

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please sign in to add to wishlist');
      return;
    }
    try {
      await toggleWishlist(product._id).unwrap();
      toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
    } catch {
      toast.error('Failed to update wishlist');
    }
  };

  return (
    <Link to={`/products/${slug}`} className="group h-full">
      <div className="bg-surface rounded overflow-hidden border border-bg/50 transition-all duration-300 hover:shadow-sm h-full flex flex-col">
        <div className="relative aspect-square overflow-hidden bg-bg shrink-0">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <button
            onClick={handleWishlist}
            className="absolute top-2 sm:top-3 right-2 sm:right-3 p-2.5 bg-white/80 rounded-full hover:bg-white transition-colors flex items-center justify-center"
          >
            <Heart size={16} className={`${isWishlisted ? 'fill-primary text-primary' : 'text-text-muted hover:text-primary'}`} />
          </button>
          {isNewArrival && <Badge variant="accent" className="absolute top-2 sm:top-3 left-2 sm:left-3 text-[10px] sm:text-xs">New</Badge>}
          {isBestSeller && <Badge variant="primary" className="absolute top-2 sm:top-3 left-2 sm:left-3 text-[10px] sm:text-xs">Best Seller</Badge>}
        </div>
        <div className="p-fluid-3 sm:p-fluid-4 flex-1 flex flex-col justify-between gap-1">
          <div className="space-y-1">
            <h3 className="font-serif text-sm sm:text-lg font-medium text-text group-hover:text-primary transition-colors line-clamp-2">
              {title}
            </h3>
            {metal?.purity && (
              <p className="text-xs sm:text-sm text-text-muted truncate">{metal.purity} {metal.type}</p>
            )}
          </div>
          <div>
            <p className="font-medium text-primary text-sm sm:text-base">
              ₹{displayPrice.toLocaleString('en-IN')}
            </p>
            {weightGrams && <p className="text-xs text-text-muted">{weightGrams}g</p>}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
