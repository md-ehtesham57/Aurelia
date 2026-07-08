import { useState } from 'react';
import { useGetAdminBannersQuery, useCreateBannerMutation, useUpdateBannerMutation } from '../../features/admin/adminApi';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import ImageUploader from '../../components/common/ImageUploader';
import toast from 'react-hot-toast';

const emptyForm = { title: '', linkUrl: '', position: 'homepage_hero', images: [], isActive: true };

const BannerForm = ({ banner, onClose }) => {
  const [createBanner] = useCreateBannerMutation();
  const [updateBanner] = useUpdateBannerMutation();
  const isEdit = !!banner;
  const [form, setForm] = useState({
    title: banner?.title || '',
    linkUrl: banner?.linkUrl || '',
    position: banner?.position || 'homepage_hero',
    images: banner?.image ? [{ url: banner.image }] : [],
    isActive: banner?.isActive ?? true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.images.length) { toast.error('Please upload an image'); return; }
    try {
      const payload = {
        title: form.title || 'Untitled',
        image: form.images[0].url,
        linkUrl: form.linkUrl || undefined,
        position: form.position,
        isActive: form.isActive,
      };
      if (isEdit) {
        await updateBanner({ id: banner._id, ...payload }).unwrap();
        toast.success('Banner updated');
      } else {
        await createBanner(payload).unwrap();
        toast.success('Banner created');
      }
      onClose();
    } catch {
      toast.error(isEdit ? 'Failed to update banner' : 'Failed to create banner');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      <Input label="Link URL" value={form.linkUrl} onChange={(e) => setForm({ ...form, linkUrl: e.target.value })} />
      <div>
        <label className="block text-sm font-medium mb-1">Position</label>
        <select
          value={form.position}
          onChange={(e) => setForm({ ...form, position: e.target.value })}
          className="w-full bg-bg border border-bg rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="homepage_hero">Homepage Hero</option>
          <option value="homepage_strip">Homepage Strip</option>
          <option value="category_top">Category Top</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isActive"
          checked={form.isActive}
          onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
          className="accent-primary"
        />
        <label htmlFor="isActive" className="text-sm">Active</label>
      </div>
      <ImageUploader images={form.images} onChange={(imgs) => setForm({ ...form, images: imgs })} maxImages={1} />
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
        <Button type="submit" disabled={!form.images.length}>{isEdit ? 'Update' : 'Create'}</Button>
      </div>
    </form>
  );
};

const BannerManager = () => {
  const { data, isLoading } = useGetAdminBannersQuery();
  const [modal, setModal] = useState(null);

  const banners = data?.data?.banners || [];

  if (isLoading) return <Loader />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h3 className="font-serif text-base sm:text-lg">Banners</h3>
        <Button size="sm" className="w-full sm:w-auto" onClick={() => setModal({})}>Add Banner</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {banners.map((banner) => (
          <div key={banner._id} className="bg-surface rounded p-3 sm:p-4">
            <div className="aspect-[2/1] bg-bg rounded mb-3 overflow-hidden">
              <img src={banner.image} alt={banner.title} className="w-full h-full object-cover rounded" />
            </div>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h4 className="font-medium text-sm sm:text-base truncate">{banner.title || 'Untitled'}</h4>
                <p className="text-xs text-text-muted capitalize">{banner.position.replace(/_/g, ' ')}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-xs px-2 py-0.5 rounded-full ${banner.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {banner.isActive ? 'Active' : 'Inactive'}
                </span>
                <button onClick={() => setModal(banner)} className="text-xs text-primary hover:text-primary-dark transition-colors">Edit</button>
              </div>
            </div>
          </div>
        ))}
        {banners.length === 0 && (
          <p className="text-text-muted col-span-full text-center py-12">No banners yet</p>
        )}
      </div>

      <Modal isOpen={!!modal} onClose={() => setModal(null)} title={modal?._id ? 'Edit Banner' : 'Add Banner'}>
        {modal && <BannerForm banner={modal?._id ? modal : null} onClose={() => setModal(null)} />}
      </Modal>
    </div>
  );
};

export default BannerManager;
