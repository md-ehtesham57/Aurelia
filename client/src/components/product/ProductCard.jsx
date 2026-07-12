import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Check } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToggleWishlistMutation, useGetWishlistQuery } from '../../features/auth/authApi';
import { useAddToCartMutation } from '../../features/cart/cartApi';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { isAuthenticated } = useAuth();
  const { data: wishlistData } = useGetWishlistQuery(undefined, { skip: !isAuthenticated });
  const [toggleWishlist, { isLoading: isWishlistLoading }] = useToggleWishlistMutation();
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();
  const [justAdded, setJustAdded] = useState(false);

  const wishlistIds = wishlistData?.data?.wishlist?.map((p) => p._id || p) || [];
  const isWishlisted = wishlistIds.includes(product._id);

  const { title, slug, images, metal, weightGrams, basePriceOverride, priceBreakdown, isNewArrival, isBestSeller } = product;
  const displayPrice = priceBreakdown?.total || basePriceOverride || 0;
  const hasPrice = displayPrice > 0;
  const image = images?.[0]?.url || '/placeholder.svg';

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
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

  const handleQuickAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart({ product: product._id, qty: 1 }).unwrap();
      toast.success('Added to cart');
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 1800);
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  const handleImageError = (e) => {
    if (e.target.src.endsWith('/placeholder.svg')) return;
    e.target.src = '/placeholder.svg';
  };

  // Shared button renderers — one implementation, two placements (image overlay on desktop, details row on mobile)
  const renderWishlistButton = (extra = '') => (
    <button
      onClick={handleWishlist}
      disabled={isWishlistLoading}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      aria-pressed={isWishlisted}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-surface/70 shadow-sm backdrop-blur-md
                  border border-surface/40 transition-all duration-200
                  hover:bg-surface/90 hover:scale-110 active:scale-95
                  disabled:opacity-50 disabled:cursor-not-allowed
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${extra}`}
    >
      <Heart
        size={15}
        className={`transition-colors duration-200 ${isWishlisted ? 'fill-primary text-primary' : 'text-text-muted'}`}
      />
    </button>
  );

  const renderQuickAddButton = (extra = '') => (
    <button
      onClick={handleQuickAdd}
      disabled={isAddingToCart}
      aria-label="Add to cart"
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-surface/70 shadow-sm backdrop-blur-md
                  border border-surface/40 transition-all duration-200
                  hover:bg-surface/90 hover:scale-110 active:scale-95
                  disabled:opacity-50 disabled:cursor-not-allowed
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${extra}`}
    >
      {justAdded ? (
        <Check size={15} className="text-success" />
      ) : (
        <ShoppingBag size={15} className="text-text-muted" />
      )}
    </button>
  );

  return (
    <Link to={`/products/${slug}`} className="group relative block h-full w-full">
      <div
        className="flex h-full flex-col overflow-hidden rounded-2xl
                   border border-surface/60 bg-surface/40 backdrop-blur-md p-2.5
                   shadow-[0_8px_28px_-8px_rgba(43,38,32,0.12)] transition-all duration-300 ease-out
                   hover:-translate-y-1 hover:bg-surface/70 hover:border-surface/80
                   hover:shadow-[0_16px_36px_-10px_rgba(43,38,32,0.18)]"
      >
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-bg shrink-0">
          <img
            src={image}
            alt={title}
            onError={handleImageError}
            className="h-full w-full object-cover"
            loading="lazy"
          />

          {/* Subtle overlay, gives the badges contrast without darkening the product itself */}
          <div className="hidden sm:block absolute inset-0 bg-text/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Badges — visible at all breakpoints */}
          {(isNewArrival || isBestSeller) && (
            <div className="absolute left-2.5 top-2.5 z-10 flex flex-col items-start gap-1 pointer-events-none">
              {isNewArrival && (
                <span className="rounded-md bg-accent/85 backdrop-blur-sm text-[10px] sm:text-xs font-medium tracking-widest uppercase text-white shadow-sm px-2.5 py-1">
                  New
                </span>
              )}
              {isBestSeller && (
                <span className="rounded-md bg-primary/85 backdrop-blur-sm text-[10px] sm:text-xs font-medium tracking-widest uppercase text-white shadow-sm px-2.5 py-1">
                  Best Seller
                </span>
              )}
            </div>
          )}

          {/* Desktop only: hover-reveal action buttons on the image. Hidden on touch so the product shot stays unobstructed. */}
          <div className="hidden sm:flex absolute right-2.5 top-2.5 z-10 flex-col gap-2">
            {renderWishlistButton('opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0')}
            {renderQuickAddButton('opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0')}
          </div>
        </div>

        {/* Identity zone + price zone */}
        <div className="flex flex-1 flex-col pt-3 px-1.5">
          <div>
            <h3 className="font-serif text-sm sm:text-lg font-medium text-text group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5em] sm:min-h-[2.8em] leading-tight">
              {title}
            </h3>
            {(metal?.purity || weightGrams) && (
              <p className="text-xs sm:text-sm text-text-muted mt-1 truncate">
                {[metal?.purity && `${metal.purity} ${metal.type}`, weightGrams && `${weightGrams}g`]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
            )}
          </div>

          {/* Price row. On mobile, action buttons live here instead of on the image. */}
          <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-surface/60 flex items-center justify-between gap-2">
            {hasPrice ? (
              <p className="font-serif font-semibold text-primary text-base sm:text-xl">
                ₹{displayPrice.toLocaleString('en-IN')}
              </p>
            ) : (
              <p className="font-medium text-text-muted text-sm sm:text-base">Price on request</p>
            )}

            <div className="flex sm:hidden items-center gap-1.5 shrink-0">
              {renderWishlistButton()}
              {renderQuickAddButton()}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;