import { useState, useEffect } from 'react';
import { useGetCategoriesQuery } from '../../features/admin/adminApi';
import { useCreateProductMutation, useUpdateProductMutation } from '../../features/products/productApi';
import Button from '../common/Button';
import Input from '../common/Input';
import ImageUploader from '../common/ImageUploader';
import toast from 'react-hot-toast';

const emptyForm = {
  title: '', sku: '', description: '', shortDescription: '',
  category: '', collectionTags: '',
  metalType: '', metalPurity: '', metalColor: '',
  weightGrams: '', makingChargeType: 'percentage', makingChargeValue: '',
  basePriceOverride: '',
  gender: '', occasion: '',
  isFeatured: false, isBestSeller: false, isNewArrival: false,
  status: 'draft',
  seoMetaTitle: '', seoMetaDescription: '',
};

const ProductForm = ({ product, onClose }) => {
  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState([]);
  const { data: catData } = useGetCategoriesQuery();
  const [createProduct, { isLoading: creating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();

  const categories = catData?.data?.categories || [];
  const isEditing = !!product;
  const saving = creating || updating;

  useEffect(() => {
    if (product) {
      setForm({
        title: product.title || '',
        sku: product.sku || '',
        description: product.description || '',
        shortDescription: product.shortDescription || '',
        category: product.category?._id || product.category || '',
        collectionTags: product.collectionTags?.join(', ') || '',
        metalType: product.metal?.type || '',
        metalPurity: product.metal?.purity || '',
        metalColor: product.metal?.color || '',
        weightGrams: product.weightGrams || '',
        makingChargeType: product.makingChargeType || 'percentage',
        makingChargeValue: product.makingChargeValue || '',
        basePriceOverride: product.basePriceOverride || '',
        gender: product.gender || '',
        occasion: product.occasion?.join(', ') || '',
        isFeatured: product.isFeatured || false,
        isBestSeller: product.isBestSeller || false,
        isNewArrival: product.isNewArrival || false,
        status: product.status || 'draft',
        seoMetaTitle: product.seo?.metaTitle || '',
        seoMetaDescription: product.seo?.metaDescription || '',
      });
      setImages(product.images || []);
    }
  }, [product]);

  const buildPayload = () => {
    const payload = {
      title: form.title,
      sku: form.sku,
      description: form.description,
      shortDescription: form.shortDescription,
      category: form.category || undefined,
      collectionTags: form.collectionTags ? form.collectionTags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      images: images.map((img, i) => ({ ...img, order: i })),
      metal: form.metalType ? {
        type: form.metalType,
        purity: form.metalPurity || undefined,
        color: form.metalColor || undefined,
      } : undefined,
      weightGrams: form.weightGrams ? Number(form.weightGrams) : undefined,
      makingChargeType: form.makingChargeValue ? form.makingChargeType : undefined,
      makingChargeValue: form.makingChargeValue ? Number(form.makingChargeValue) : undefined,
      basePriceOverride: form.basePriceOverride ? Number(form.basePriceOverride) : undefined,
      gender: form.gender || undefined,
      occasion: form.occasion ? form.occasion.split(',').map((o) => o.trim()).filter(Boolean) : [],
      isFeatured: form.isFeatured,
      isBestSeller: form.isBestSeller,
      isNewArrival: form.isNewArrival,
      status: form.status,
      seo: {
        metaTitle: form.seoMetaTitle || undefined,
        metaDescription: form.seoMetaDescription || undefined,
      },
    };
    Object.keys(payload).forEach((k) => {
      if (payload[k] === undefined) delete payload[k];
    });
    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.sku) {
      toast.error('Title and SKU are required');
      return;
    }
    try {
      const payload = buildPayload();
      if (isEditing) {
        await updateProduct({ id: product._id, ...payload }).unwrap();
        toast.success('Product updated');
      } else {
        await createProduct(payload).unwrap();
        toast.success('Product created');
      }
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to save product');
    }
  };

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Title *" value={form.title} onChange={(e) => update('title', e.target.value)} required />
        <Input label="SKU *" value={form.sku} onChange={(e) => update('sku', e.target.value)} required />
      </div>

      <Input label="Short Description" value={form.shortDescription} onChange={(e) => update('shortDescription', e.target.value)} />

      <div>
        <label className="block text-sm font-medium text-text mb-1">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
          rows={4}
          className="w-full px-4 py-2.5 bg-bg rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      <ImageUploader images={images} onChange={setImages} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-text">Category</label>
          <select
            value={form.category}
            onChange={(e) => update('category', e.target.value)}
            className="w-full px-4 py-2.5 bg-bg rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="">None</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <Input label="Collection Tags (comma-separated)" value={form.collectionTags} onChange={(e) => update('collectionTags', e.target.value)} />
      </div>

      <div className="border-t border-bg pt-4">
        <h4 className="text-sm font-semibold mb-3">Metal & Pricing</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-text">Metal Type</label>
            <select value={form.metalType} onChange={(e) => update('metalType', e.target.value)} className="w-full px-4 py-2.5 bg-bg rounded focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option value="">None</option>
              <option value="gold">Gold</option>
              <option value="silver">Silver</option>
              <option value="platinum">Platinum</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-text">Purity</label>
            <select value={form.metalPurity} onChange={(e) => update('metalPurity', e.target.value)} className="w-full px-4 py-2.5 bg-bg rounded focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option value="">None</option>
              <option value="9K">9K</option>
              <option value="14K">14K</option>
              <option value="18K">18K</option>
              <option value="22K">22K</option>
              <option value="24K">24K</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-text">Metal Color</label>
            <select value={form.metalColor} onChange={(e) => update('metalColor', e.target.value)} className="w-full px-4 py-2.5 bg-bg rounded focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option value="">None</option>
              <option value="yellow">Yellow</option>
              <option value="rose">Rose</option>
              <option value="white">White</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
          <Input label="Weight (grams)" type="number" value={form.weightGrams} onChange={(e) => update('weightGrams', e.target.value)} />
          <Input label="Base Price Override (₹)" type="number" value={form.basePriceOverride} onChange={(e) => update('basePriceOverride', e.target.value)} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-text">Making Charge Type</label>
            <select value={form.makingChargeType} onChange={(e) => update('makingChargeType', e.target.value)} className="w-full px-4 py-2.5 bg-bg rounded focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option value="percentage">Percentage</option>
              <option value="flat">Flat (₹)</option>
            </select>
          </div>
          <Input label="Making Charge Value" type="number" value={form.makingChargeValue} onChange={(e) => update('makingChargeValue', e.target.value)} />
        </div>
      </div>

      <div className="border-t border-bg pt-4">
        <h4 className="text-sm font-semibold mb-3">Classification</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-text">Gender</label>
            <select value={form.gender} onChange={(e) => update('gender', e.target.value)} className="w-full px-4 py-2.5 bg-bg rounded focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option value="">None</option>
              <option value="women">Women</option>
              <option value="men">Men</option>
              <option value="kids">Kids</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>
          <Input label="Occasion (comma-separated)" value={form.occasion} onChange={(e) => update('occasion', e.target.value)} />
        </div>
      </div>

      <div className="border-t border-bg pt-4">
        <h4 className="text-sm font-semibold mb-3">Visibility</h4>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isFeatured} onChange={(e) => update('isFeatured', e.target.checked)} className="accent-primary" />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isBestSeller} onChange={(e) => update('isBestSeller', e.target.checked)} className="accent-primary" />
            Best Seller
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isNewArrival} onChange={(e) => update('isNewArrival', e.target.checked)} className="accent-primary" />
            New Arrival
          </label>
        </div>
        <div className="mt-3">
          <label className="block text-sm font-medium text-text mb-1">Status</label>
          <select value={form.status} onChange={(e) => update('status', e.target.value)} className="w-full px-4 py-2.5 bg-bg rounded focus:outline-none focus:ring-2 focus:ring-primary/50">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="hidden">Hidden</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
      </div>

      <div className="border-t border-bg pt-4">
        <h4 className="text-sm font-semibold mb-3">SEO</h4>
        <Input label="Meta Title" value={form.seoMetaTitle} onChange={(e) => update('seoMetaTitle', e.target.value)} />
        <div className="mt-3">
          <label className="block text-sm font-medium text-text mb-1">Meta Description</label>
          <textarea
            value={form.seoMetaDescription}
            onChange={(e) => update('seoMetaDescription', e.target.value)}
            rows={2}
            className="w-full px-4 py-2.5 bg-bg rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-bg">
        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving...' : isEditing ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
