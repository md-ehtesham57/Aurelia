import { useGetBannersQuery, useCreateBannerMutation } from '../../features/admin/adminApi';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

const BannerManager = () => {
  const { data, isLoading } = useGetBannersQuery();
  const [createBanner] = useCreateBannerMutation();
  const banners = data?.data?.banners || [];

  const handleCreate = async () => {
    try {
      await createBanner({
        title: 'New Banner',
        image: '/placeholder.svg',
        position: 'homepage_hero',
        isActive: true,
      }).unwrap();
      toast.success('Banner created');
    } catch {
      toast.error('Failed to create banner');
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h3 className="font-serif text-base sm:text-lg">Banners</h3>
        <Button size="sm" className="w-full sm:w-auto" onClick={handleCreate}>Add Banner</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {banners.map((banner) => (
          <div key={banner._id} className="bg-surface rounded p-3 sm:p-4">
            <div className="aspect-[2/1] bg-bg rounded mb-3">
              <img src={banner.image} alt={banner.title} className="w-full h-full object-cover rounded" />
            </div>
            <div>
              <h4 className="font-medium text-sm sm:text-base">{banner.title || 'Untitled'}</h4>
              <p className="text-xs text-text-muted capitalize">{banner.position.replace(/_/g, ' ')}</p>
            </div>
          </div>
        ))}
        {banners.length === 0 && (
          <p className="text-text-muted col-span-full text-center py-12">No banners yet</p>
        )}
      </div>
    </div>
  );
};

export default BannerManager;
