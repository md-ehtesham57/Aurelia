import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../components/common/Button';
import ProductCard from '../components/product/ProductCard';
import { useGetProductsQuery } from '../features/products/productApi';
import { useGetCategoriesQuery, useGetBannersQuery } from '../features/admin/adminApi';
import Loader from '../components/common/Loader';

const HeroBanner = ({ banners }) => {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((c) => (c + 1) % banners.length), [banners.length]);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + banners.length) % banners.length), [banners.length]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [banners.length, next]);

  if (!banners.length) {
    return (
      <section className="relative bg-bg py-fluid-12 sm:py-fluid-16 lg:py-fluid-32">
        <div className="max-w-7xl mx-auto px-fluid-4">
          <div className="max-w-2xl">
            <p className="text-primary font-medium text-xs sm:text-sm tracking-widest uppercase mb-fluid-3 sm:mb-fluid-4">Fine Jewelry Collection</p>
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-7xl text-text mb-fluid-4 sm:mb-fluid-6 leading-tight">Wear the Warmth <br className="hidden xs:inline sm:hidden" />of Gold.</h1>
            <p className="text-text-muted text-sm sm:text-base lg:text-lg mb-fluid-6 sm:mb-fluid-8 leading-relaxed max-w-prose">Discover handcrafted jewelry that celebrates life's precious moments. From everyday elegance to timeless heirlooms.</p>
            <div className="flex flex-col sm:flex-row gap-fluid-3 sm:gap-fluid-4">
              <Link to="/products"><Button size="lg" className="w-full sm:w-auto">Explore Collection</Button></Link>
              <Link to="/products?category=rings"><Button variant="outline" size="lg" className="w-full sm:w-auto">View Rings</Button></Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const banner = banners[current];

  return (
    <section className="overflow-hidden bg-bg py-fluid-4 sm:py-fluid-6">
      <div className="relative max-w-7xl mx-auto px-fluid-4">
        {/* One aspect ratio, used at every breakpoint — the image scales with viewport width,
            it never reshapes/re-crops as the screen size changes. Contained to match the same
            max-w-7xl width as the navbar and every other section on the page. */}
        <div className="relative aspect-[16/9] overflow-hidden rounded-xl">
          <img
            src={banner.image}
            alt={banner.title}
            className="absolute inset-0 w-full h-full object-cover object-center"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <div className="px-fluid-4 pb-fluid-6 sm:pb-fluid-10 w-full">
              {/* Single clamp() for the whole viewport range — no breakpoint jumps in type size either */}
              <div className="max-w-[min(80%,28rem)]">
                {banner.title && (
                  <h1 className="font-serif text-white leading-tight text-[clamp(1.25rem,4.5vw,3.25rem)] mb-fluid-2 sm:mb-fluid-4">
                    {banner.title}
                  </h1>
                )}
                {banner.linkUrl && (
                  <Link to={banner.linkUrl}>
                    <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black text-xs sm:text-sm">
                      Shop Now
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {banners.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm rounded-full transition-all z-10"
                aria-label="Previous banner"
              >
                <ChevronLeft size={16} className="sm:size-5" />
              </button>
              <button
                onClick={next}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm rounded-full transition-all z-10"
                aria-label="Next banner"
              >
                <ChevronRight size={16} className="sm:size-5" />
              </button>
              <div className="absolute bottom-2 sm:bottom-4 inset-x-0 flex justify-center gap-2 z-10">
                {banners.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full transition-all ${i === current ? 'bg-white scale-110' : 'bg-white/40 hover:bg-white/60'}`}
                    aria-label={`Go to banner ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
          {banner.linkUrl && (
            <Link to={banner.linkUrl} className="absolute inset-0 z-0" aria-label={banner.title || 'Banner'} />
          )}
        </div>
      </div>
    </section>
  );
};

const Home = () => {
  const { data, isLoading } = useGetProductsQuery({ limit: 8, sort: 'newest' });
  const { data: catData } = useGetCategoriesQuery();
  const { data: bannerData } = useGetBannersQuery();
  const products = data?.data?.products || [];
  const categories = catData?.data?.categories || [];
  const heroBanners = (bannerData?.data?.banners || []).filter((b) => b.position === 'homepage_hero');
  const stripBanners = (bannerData?.data?.banners || []).filter((b) => b.position === 'homepage_strip');

  return (
    <div>
      <HeroBanner banners={heroBanners} />

      <section className="max-w-7xl mx-auto px-fluid-4 py-fluid-10 sm:py-fluid-16">
        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between mb-fluid-6 sm:mb-fluid-10">
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-fluid-4 sm:gap-fluid-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-accent text-white py-fluid-12 sm:py-fluid-16">
        <div className="max-w-7xl mx-auto px-fluid-4 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl mb-fluid-4">Handcrafted with Care</h2>
          <p className="text-white/80 text-sm sm:text-base max-w-xl mx-auto mb-fluid-8">
            Each piece is crafted by master artisans using ethically sourced materials.
            Certified purity. Lifetime craftsmanship guarantee.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-fluid-6 sm:gap-fluid-8 max-w-3xl mx-auto">
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

      {stripBanners.map((banner) => (
        <section key={banner._id} className="px-fluid-4 py-fluid-6">
          <div className="max-w-7xl mx-auto overflow-hidden rounded shadow-[0_4px_16px_-4px_rgba(43,38,32,0.08)]">
            <Link to={banner.linkUrl || '#'} className="relative block aspect-[3/1] sm:aspect-[5/1] min-h-[80px] max-h-[200px]">
              <img src={banner.image} alt={banner.title} className="absolute inset-0 w-full h-full object-cover object-center" loading="lazy" />
              {banner.title && (
                <div className="absolute inset-0 flex items-center justify-center p-fluid-4">
                  <h2 className="font-serif text-white bg-black/40 px-fluid-4 py-fluid-2 rounded text-center
                    text-[clamp(0.875rem,3vw,1.5rem)] sm:text-[clamp(1rem,2.5vw,2rem)] leading-tight">
                    {banner.title}
                  </h2>
                </div>
              )}
            </Link>
          </div>
        </section>
      ))}

      <section className="max-w-7xl mx-auto px-fluid-4 py-fluid-12 sm:py-fluid-16">
        <h2 className="font-serif text-2xl sm:text-3xl text-text mb-fluid-6 sm:mb-fluid-8 text-center sm:text-left">Shop by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-fluid-4 sm:gap-fluid-8">
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