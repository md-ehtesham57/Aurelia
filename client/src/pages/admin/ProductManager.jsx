import { useState } from 'react';
import { Plus, Eye, Edit3, Trash2 } from 'lucide-react';
import { useGetAdminProductsQuery, useUpdateProductStatusMutation, useDeleteProductMutation } from '../../features/products/productApi';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import ProductForm from '../../components/product/ProductForm';
import toast from 'react-hot-toast';

const ProductManager = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const { data, isLoading } = useGetAdminProductsQuery({ status: statusFilter || undefined });
  const [updateStatus] = useUpdateProductStatusMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [formModal, setFormModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [viewProduct, setViewProduct] = useState(null);

  const products = data?.data?.products || [];

  const handleStatusChange = async (id, status) => {
    try {
      await updateStatus({ id, status }).unwrap();
      toast.success(`Product ${status}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    try {
      await deleteProduct(deleteModal).unwrap();
      toast.success('Product deleted');
      setDeleteModal(null);
    } catch {
      toast.error('Failed to delete product');
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs sm:text-sm bg-surface border border-bg rounded px-2 sm:px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="hidden">Hidden</option>
            <option value="out_of_stock">Out of Stock</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <Button size="sm" className="w-full sm:w-auto" onClick={() => setFormModal({})}>
          <Plus size={16} className="mr-1" /> Add Product
        </Button>
      </div>

      <div className="bg-surface rounded overflow-hidden">
        <div className="overflow-x-auto hidden sm:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-bg text-left">
                <th className="p-4 font-medium text-text-muted">Product</th>
                <th className="p-4 font-medium text-text-muted">SKU</th>
                <th className="p-4 font-medium text-text-muted">Category</th>
                <th className="p-4 font-medium text-text-muted">Metal</th>
                <th className="p-4 font-medium text-text-muted">Price</th>
                <th className="p-4 font-medium text-text-muted">Status</th>
                <th className="p-4 font-medium text-text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b border-bg/50 hover:bg-bg/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-bg rounded overflow-hidden shrink-0">
                        <img src={product.images?.[0]?.url || '/placeholder.svg'} alt="" className="w-full h-full object-cover" />
                      </div>
                      <span className="font-medium truncate max-w-[200px]">{product.title}</span>
                    </div>
                  </td>
                  <td className="p-4 text-text-muted">{product.sku}</td>
                  <td className="p-4 text-text-muted">{product.category?.name || '—'}</td>
                  <td className="p-4 text-text-muted">
                    {product.metal?.purity ? `${product.metal.purity} ${product.metal.type}` : '—'}
                  </td>
                  <td className="p-4">₹{((product.priceBreakdown?.total || product.basePriceOverride) || 0).toLocaleString('en-IN')}</td>
                  <td className="p-4">
                    <select
                      value={product.status}
                      onChange={(e) => handleStatusChange(product._id, e.target.value)}
                      className="text-xs bg-transparent border border-bg rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="hidden">Hidden</option>
                      <option value="out_of_stock">Out of Stock</option>
                      <option value="archived">Archived</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewProduct(product)}
                        className="p-1.5 hover:bg-bg rounded"
                        title="View"
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        onClick={() => setFormModal(product)}
                        className="p-1.5 hover:bg-bg rounded"
                        title="Edit"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteModal(product._id)}
                        className="p-1.5 hover:bg-bg rounded text-error"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="sm:hidden space-y-3 p-4">
          {products.length === 0 ? (
            <p className="text-center text-text-muted py-8">No products found</p>
          ) : (
            products.map((product) => (
              <div key={product._id} className="border border-bg/50 rounded p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 bg-bg rounded overflow-hidden shrink-0">
                    <img src={product.images?.[0]?.url || '/placeholder.svg'} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{product.title}</p>
                    <p className="text-xs text-text-muted">{product.sku}</p>
                    <p className="text-xs text-text-muted">{product.category?.name || '—'} • {product.metal?.purity ? `${product.metal.purity} ${product.metal.type}` : '—'}</p>
                    <p className="text-sm font-medium text-primary mt-1">₹{((product.priceBreakdown?.total || product.basePriceOverride) || 0).toLocaleString('en-IN')}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <select
                    value={product.status}
                    onChange={(e) => handleStatusChange(product._id, e.target.value)}
                    className="text-xs bg-surface border border-bg rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="hidden">Hidden</option>
                    <option value="out_of_stock">Out of Stock</option>
                    <option value="archived">Archived</option>
                  </select>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setViewProduct(product)} className="p-1.5 hover:bg-bg rounded" title="View"><Eye size={15} /></button>
                    <button onClick={() => setFormModal(product)} className="p-1.5 hover:bg-bg rounded" title="Edit"><Edit3 size={15} /></button>
                    <button onClick={() => setDeleteModal(product._id)} className="p-1.5 hover:bg-bg rounded text-error" title="Delete"><Trash2 size={15} /></button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Modal
        isOpen={!!formModal}
        onClose={() => setFormModal(null)}
        title={formModal?._id ? 'Edit Product' : 'Add Product'}
        size="xl"
      >
        <ProductForm product={formModal?._id ? formModal : null} onClose={() => setFormModal(null)} />
      </Modal>

      <Modal
        isOpen={!!viewProduct}
        onClose={() => setViewProduct(null)}
        title={viewProduct?.title || 'Product Details'}
        size="lg"
      >
        {viewProduct && (
          <div className="space-y-4 text-sm">
            <div className="flex gap-4">
              <div className="w-40 h-40 bg-bg rounded overflow-hidden shrink-0">
                <img src={viewProduct.images?.[0]?.url || '/placeholder.svg'} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="space-y-2">
                <p><span className="text-text-muted">SKU:</span> {viewProduct.sku}</p>
                <p><span className="text-text-muted">Category:</span> {viewProduct.category?.name || '—'}</p>
                <p><span className="text-text-muted">Metal:</span> {viewProduct.metal?.purity ? `${viewProduct.metal.purity} ${viewProduct.metal.type}` : '—'}</p>
                <p><span className="text-text-muted">Weight:</span> {viewProduct.weightGrams ? `${viewProduct.weightGrams}g` : '—'}</p>
                <p><span className="text-text-muted">Price:</span> ₹{((viewProduct.priceBreakdown?.total || viewProduct.basePriceOverride) || 0).toLocaleString('en-IN')}</p>
                <p><span className="text-text-muted">Status:</span> <span className="capitalize">{viewProduct.status}</span></p>
              </div>
            </div>
            {viewProduct.description && (
              <div>
                <p className="text-text-muted mb-1">Description:</p>
                <p className="leading-relaxed">{viewProduct.description}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal isOpen={!!deleteModal} onClose={() => setDeleteModal(null)} title="Delete Product">
        <p className="text-sm text-text-muted mb-4">Are you sure you want to delete this product? This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setDeleteModal(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
};

export default ProductManager;
