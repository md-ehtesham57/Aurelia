import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Button from '../components/common/Button';
import ProductCard from '../components/product/ProductCard';
import { useGetProductsQuery } from '../features/products/productApi';
import { useGetCategoriesQuery } from '../features/admin/adminApi';
import Loader from '../components/common/Loader';

const Home = () => {
  const { data, isLoading } = useGetProductsQuery({ limit: 8, sort: 'newest' });
  const { data: catData } = useGetCategoriesQuery();
  const products = data?.data?.products || [];
  const categories = catData?.data?.categories || [];

  return (
    <div>
      <section className="relative bg-bg py-12 sm:py-16 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
          <div className="max-w-2xl">
            <p className="text-primary font-medium text-xs sm:text-sm tracking-widest uppercase mb-3 sm:mb-4">
              Fine Jewelry Collection
            </p>
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-7xl text-text mb-4 sm:mb-6 leading-tight">
              Wear the Warmth <br className="hidden xs:inline sm:hidden" />of Gold.
            </h1>
            <p className="text-text-muted text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 leading-relaxed max-w-prose">
              Discover handcrafted jewelry that celebrates life's precious moments.
              From everyday elegance to timeless heirlooms.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link to="/products">
                <Button size="lg" className="w-full sm:w-auto">Explore Collection</Button>
              </Link>
              <Link to="/products?category=rings">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">View Rings</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between mb-6 sm:mb-10">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl text-text">New Arrivals</h2>
            <p className="text-text-muted text-sm sm:text-base mt-1">The latest additions to our collection</p>
          </div>
          <Link to="/products?sort=newest" className="text-sm text-primary hover:text-primary-dark flex items-center gap-1 transition-colors mt-2 xs:mt-0">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        {isLoading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-accent text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl mb-4">Handcrafted with Care</h2>
          <p className="text-white/80 text-sm sm:text-base max-w-xl mx-auto mb-8">
            Each piece is crafted by master artisans using ethically sourced materials.
            Certified purity. Lifetime craftsmanship guarantee.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 max-w-3xl mx-auto">
            <div>
              <p className="text-xl sm:text-2xl font-serif font-bold">100%</p>
              <p className="text-xs sm:text-sm text-white/70">Certified Purity</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-serif font-bold">15 Days</p>
              <p className="text-xs sm:text-sm text-white/70">Easy Returns</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-serif font-bold">Free</p>
              <p className="text-xs sm:text-sm text-white/70">Insured Shipping</p>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-serif font-bold">Lifetime</p>
              <p className="text-xs sm:text-sm text-white/70">Exchange Policy</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
        <h2 className="font-serif text-2xl sm:text-3xl text-text mb-6 sm:mb-8 text-center sm:text-left">Shop by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
          {categories.length > 0 ? categories.map((cat) => (
            <Link key={cat._id} to={`/products?category=${cat.slug}`} className="group relative aspect-[3/2] sm:aspect-[4/5] bg-bg rounded overflow-hidden">
              {cat.image ? (
                <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6">
                <h3 className="font-serif text-xl sm:text-2xl text-white">{cat.name}</h3>
                <p className="text-xs sm:text-sm text-white/80">Explore <ArrowRight size={14} className="inline" /></p>
              </div>
            </Link>
          )) : (
            <>
              {['Rings', 'Necklaces', 'Earrings'].map((name) => (
                <Link key={name} to={`/products?category=${name.toLowerCase()}`} className="group relative aspect-[3/2] sm:aspect-[4/5] bg-bg rounded overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                  <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6">
                    <h3 className="font-serif text-xl sm:text-2xl text-white">{name}</h3>
                    <p className="text-xs sm:text-sm text-white/80">Explore <ArrowRight size={14} className="inline" /></p>
                  </div>
                </Link>
              ))}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
