import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Button from '../components/common/Button';
import ProductCard from '../components/product/ProductCard';
import { useGetProductsQuery } from '../features/products/productApi';
import Loader from '../components/common/Loader';

const Home = () => {
  const { data, isLoading } = useGetProductsQuery({ limit: 8, sort: 'newest' });
  const products = data?.data?.products || [];

  return (
    <div>
      <section className="relative bg-bg py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-2xl">
            <p className="text-primary font-medium text-sm tracking-widest uppercase mb-4">
              Fine Jewelry Collection
            </p>
            <h1 className="font-serif text-5xl lg:text-7xl text-text mb-6 leading-tight">
              Wear the Warmth of Gold.
            </h1>
            <p className="text-text-muted text-lg mb-8 leading-relaxed">
              Discover handcrafted jewelry that celebrates life's precious moments.
              From everyday elegance to timeless heirlooms.
            </p>
            <div className="flex gap-4">
              <Link to="/products">
                <Button size="lg">Explore Collection</Button>
              </Link>
              <Link to="/products?category=rings">
                <Button variant="outline" size="lg">View Rings</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="font-serif text-3xl text-text">New Arrivals</h2>
            <p className="text-text-muted mt-1">The latest additions to our collection</p>
          </div>
          <Link to="/products?sort=newest" className="text-sm text-primary hover:text-primary-dark flex items-center gap-1 transition-colors">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        {isLoading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-accent text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl mb-4">Handcrafted with Care</h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8">
            Each piece is crafted by master artisans using ethically sourced materials.
            Certified purity. Lifetime craftsmanship guarantee.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div>
              <p className="text-2xl font-serif font-bold">100%</p>
              <p className="text-sm text-white/70">Certified Purity</p>
            </div>
            <div>
              <p className="text-2xl font-serif font-bold">15 Days</p>
              <p className="text-sm text-white/70">Easy Returns</p>
            </div>
            <div>
              <p className="text-2xl font-serif font-bold">Free</p>
              <p className="text-sm text-white/70">Insured Shipping</p>
            </div>
            <div>
              <p className="text-2xl font-serif font-bold">Lifetime</p>
              <p className="text-sm text-white/70">Exchange Policy</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link to="/products?category=rings" className="group relative aspect-[4/5] bg-bg rounded overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <h3 className="font-serif text-2xl text-white">Rings</h3>
              <p className="text-sm text-white/80">Explore <ArrowRight size={14} className="inline" /></p>
            </div>
          </Link>
          <Link to="/products?category=necklaces" className="group relative aspect-[4/5] bg-bg rounded overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <h3 className="font-serif text-2xl text-white">Necklaces</h3>
              <p className="text-sm text-white/80">Explore <ArrowRight size={14} className="inline" /></p>
            </div>
          </Link>
          <Link to="/products?category=earrings" className="group relative aspect-[4/5] bg-bg rounded overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <h3 className="font-serif text-2xl text-white">Earrings</h3>
              <p className="text-sm text-white/80">Explore <ArrowRight size={14} className="inline" /></p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
