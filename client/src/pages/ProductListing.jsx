import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import { useGetProductsQuery } from '../features/products/productApi';
import ProductCard from '../components/product/ProductCard';
import FilterPanel from '../components/product/FilterPanel';
import Loader from '../components/common/Loader';

const ProductListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({});

  const page = Number(searchParams.get('page')) || 1;
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const metal = filters.metal?.join(',') || searchParams.get('metal') || '';
  const purity = filters.purity?.join(',') || searchParams.get('purity') || '';
  const occasion = filters.occasion?.join(',') || searchParams.get('occasion') || '';

  const { data, isLoading } = useGetProductsQuery({ page, category, sort, metal, purity, occasion });
  const products = data?.data?.products || [];
  const pagination = data?.data?.pagination;

  const handleSort = (value) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', value);
    setSearchParams(params);
  };

  return (
    <div className="max-w-7xl mx-auto px-fluid-4 py-fluid-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-fluid-6 sm:mb-fluid-8">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-text">
            {category ? `${category.charAt(0).toUpperCase() + category.slice(1)}` : 'All Jewelry'}
          </h1>
          {pagination && (
            <p className="text-xs sm:text-sm text-text-muted mt-1">{pagination.total} pieces</p>
          )}
        </div>
        <div className="flex items-center gap-fluid-3 sm:gap-fluid-4 mt-3 sm:mt-0">
          <select
            value={sort}
            onChange={(e) => handleSort(e.target.value)}
            className="text-xs sm:text-sm bg-bg border border-bg rounded px-2 sm:px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="newest">Newest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="best_sellers">Best Sellers</option>
          </select>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm text-text-muted hover:text-text lg:hidden transition-colors"
          >
            <SlidersHorizontal size={16} />
            Filters
          </button>
        </div>
      </div>

      <div className="flex gap-fluid-8">
        <aside className="hidden lg:block w-56 shrink-0">
          <FilterPanel filters={filters} setFilters={setFilters} />
        </aside>

        {showFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilters(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-72 bg-surface p-fluid-6 overflow-y-auto">
              <FilterPanel filters={filters} setFilters={setFilters} onClose={() => setShowFilters(false)} />
            </div>
          </div>
        )}

        <main className="flex-1">
          {isLoading ? (
            <Loader />
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-text-muted">No products found.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-fluid-3 sm:gap-fluid-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {pagination && pagination.pages > 1 && (
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-fluid-8 sm:mt-fluid-12">
                  {page > 1 && (
                    <button
                      onClick={() => {
                        const params = new URLSearchParams(searchParams);
                        params.set('page', page - 1);
                        setSearchParams(params);
                      }}
                      className="hidden xs:inline-flex w-10 h-10 items-center justify-center rounded text-sm bg-surface text-text-muted hover:text-text transition-colors"
                    >
                      Prev
                    </button>
                  )}
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                    .filter((p) => {
                      if (pagination.pages <= 7) return true;
                      if (p === 1 || p === pagination.pages) return true;
                      if (Math.abs(p - page) <= 1) return true;
                      return false;
                    })
                    .map((p, idx, arr) => (
                      <span key={p} className="contents">
                        {idx > 0 && arr[idx - 1] !== p - 1 && (
                          <span className="w-4 text-center text-text-muted text-sm">...</span>
                        )}
                        <button
                          onClick={() => {
                            const params = new URLSearchParams(searchParams);
                            params.set('page', p);
                            setSearchParams(params);
                          }}
                          className={`w-9 h-9 sm:w-10 sm:h-10 rounded text-xs sm:text-sm transition-colors ${
                            p === pagination.page
                              ? 'bg-primary text-white'
                              : 'bg-surface text-text-muted hover:text-text'
                          }`}
                        >
                          {p}
                        </button>
                      </span>
                    ))}
                  {page < pagination.pages && (
                    <button
                      onClick={() => {
                        const params = new URLSearchParams(searchParams);
                        params.set('page', page + 1);
                        setSearchParams(params);
                      }}
                      className="hidden xs:inline-flex w-10 h-10 items-center justify-center rounded text-sm bg-surface text-text-muted hover:text-text transition-colors"
                    >
                      Next
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductListing;
