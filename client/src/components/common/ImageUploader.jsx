import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { useUploadImageMutation } from '../../features/admin/adminApi';
import toast from 'react-hot-toast';

const ImageUploader = ({ images = [], onChange, maxImages = 5 }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadImage] = useUploadImageMutation();

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (images.length >= maxImages) {
      toast.error(`Max ${maxImages} images allowed`);
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const result = await uploadImage(formData).unwrap();
      onChange([
        ...images,
        { url: result.data.url, publicId: result.data.publicId, altText: '', order: images.length },
      ]);
      toast.success('Image uploaded');
    } catch (err) {
      toast.error(err?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-text">Images</label>
      <div className="flex flex-wrap gap-3">
        {images.map((img, i) => (
          <div key={i} className="relative w-24 h-24 bg-bg rounded overflow-hidden group">
            <img src={img.url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute top-1 right-1 p-0.5 bg-error text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={14} />
            </button>
            <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[10px] text-center py-0.5">
              {i === 0 ? 'Cover' : `#${i + 1}`}
            </div>
          </div>
        ))}
        {images.length < maxImages && (
          <label className="w-24 h-24 border-2 border-dashed border-bg rounded flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
            {uploading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-primary" />
            ) : (
              <>
                <Upload size={18} className="text-text-muted" />
                <span className="text-[10px] text-text-muted mt-1">Upload</span>
              </>
            )}
            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
          </label>
        )}
      </div>
      <p className="text-xs text-text-muted">First image = cover. Max {maxImages} images.</p>
    </div>
  );
};

export default ImageUploader;
