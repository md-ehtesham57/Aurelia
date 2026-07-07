import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Minus, Plus, ShoppingBag, ChevronRight, Shield } from 'lucide-react';
import { useGetProductBySlugQuery } from '../features/products/productApi';
import { useAddToCartMutation } from '../features/cart/cartApi';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { slug } = useParams();
  const { data, isLoading } = useGetProductBySlugQuery(slug);
  const [addToCart] = useAddToCartMutation();
  const { isAuthenticated } = useAuth();
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const product = data?.data?.product;
  if (isLoading) return <Loader />;
  if (!product) return <div className="text-center py-20 text-text-muted">Product not found</div>;

  const images = product.images || [{ url: '/placeholder.svg' }];

  const handleAddToCart = async () => {
    try {
      await addToCart({ product: product._id, qty }).unwrap();
      toast.success('Added to cart');
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="flex items-center gap-2 text-sm text-text-muted mb-8">
        <Link to="/" className="hover:text-text transition-colors">Home</Link>
        <ChevronRight size={14} />
        {product.category && (
          <>
            <Link to={`/products?category=${product.category.slug}`} className="hover:text-text transition-colors">
              {product.category.name}
            </Link>
            <ChevronRight size={14} />
          </>
        )}
        <span className="text-text">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          <div className="aspect-square bg-bg rounded overflow-hidden">
            <img
              src={images[selectedImage]?.url}
              alt={product.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 bg-bg rounded overflow-hidden border-2 transition-colors ${
                    i === selectedImage ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            {product.isNewArrival && <Badge variant="accent" className="mb-3">New Arrival</Badge>}
            <h1 className="font-serif text-3xl text-text">{product.title}</h1>
            {product.shortDescription && (
              <p className="text-text-muted mt-2">{product.shortDescription}</p>
            )}
          </div>

          <div className="flex items-baseline gap-4">
            <span className="font-serif text-3xl text-primary">
              ₹{(product.basePriceOverride || 0).toLocaleString('en-IN')}
            </span>
            {product.metal?.purity && (
              <span className="text-sm text-text-muted">{product.metal.purity} {product.metal.type}</span>
            )}
          </div>

          {product.description && (
            <div>
              <h3 className="font-medium text-sm mb-2">Description</h3>
              <p className="text-sm text-text-muted leading-relaxed">{product.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm">
            {product.metal?.type && (
              <div><span className="text-text-muted">Metal:</span> <span className="capitalize">{product.metal.type}</span></div>
            )}
            {product.metal?.purity && (
              <div><span className="text-text-muted">Purity:</span> {product.metal.purity}</div>
            )}
            {product.weightGrams && (
              <div><span className="text-text-muted">Weight:</span> {product.weightGrams}g</div>
            )}
            {product.gender && (
              <div><span className="text-text-muted">For:</span> <span className="capitalize">{product.gender}</span></div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center border border-bg rounded">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="p-3 hover:bg-bg transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="px-4 text-sm font-medium">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="p-3 hover:bg-bg transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
            <Button onClick={handleAddToCart} size="lg" className="flex-1">
              <ShoppingBag size={18} className="mr-2" />
              Add to Cart
            </Button>
            <button className="p-3 border border-bg rounded hover:bg-bg transition-colors">
              <Heart size={20} className="text-text-muted" />
            </button>
          </div>

          <div className="border-t border-bg pt-6 space-y-3">
            <div className="flex items-center gap-3 text-sm text-text-muted">
              <Shield size={16} className="text-primary" />
              <span>Certified purity with BIS Hallmark</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-text-muted">
              <Shield size={16} className="text-primary" />
              <span>Easy 15-day returns</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-text-muted">
              <Shield size={16} className="text-primary" />
              <span>Free insured shipping</span>
            </div>
          </div>
        </div>
      </div>

      {product.reviews?.length > 0 && (
        <section className="mt-16">
          <h2 className="font-serif text-2xl mb-6">Customer Reviews</h2>
          <div className="space-y-4">
            {product.reviews.map((review) => (
              <div key={review._id} className="bg-surface rounded p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i} className={`text-sm ${i < review.rating ? 'text-primary' : 'text-bg'}`}>
                        &#9733;
                      </span>
                    ))}
                  </div>
                  <span className="text-sm font-medium">{review.user?.name}</span>
                </div>
                {review.comment && <p className="text-sm text-text-muted">{review.comment}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
