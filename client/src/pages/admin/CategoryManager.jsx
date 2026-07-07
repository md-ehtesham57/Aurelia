import { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, X } from 'lucide-react';
import { useGetCategoriesQuery, useCreateCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation, useUploadImageMutation } from '../../features/admin/adminApi';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import toast from 'react-hot-toast';

const CategoryManager = () => {
  const { data, isLoading } = useGetCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [uploadImage] = useUploadImageMutation();
  const [modal, setModal] = useState(null);
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [uploading, setUploading] = useState(false);

  const categories = data?.data?.categories || [];

  useEffect(() => {
    if (modal === 'edit' && editId) {
      const cat = categories.find((c) => c._id === editId);
      if (cat) {
        setName(cat.name);
        setDescription(cat.description || '');
        setImage(cat.image || '');
      }
    } else if (modal === 'create') {
      setName('');
      setDescription('');
      setImage('');
    }
  }, [modal, editId, categories]);

  const openEdit = (cat) => {
    setEditId(cat._id);
    setModal('edit');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const result = await uploadImage(formData).unwrap();
      setImage(result.data.url);
      toast.success('Image uploaded');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }
    try {
      const payload = { name: name.trim(), description: description.trim(), image: image || undefined };
      if (modal === 'create') {
        await createCategory(payload).unwrap();
        toast.success('Category created');
      } else {
        await updateCategory({ id: editId, ...payload }).unwrap();
        toast.success('Category updated');
      }
      setModal(null);
      setEditId(null);
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to save category');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id).unwrap();
      toast.success('Category deleted');
    } catch {
      toast.error('Failed to delete category');
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h3 className="font-serif text-base sm:text-lg">Categories</h3>
        <Button size="sm" className="w-full sm:w-auto" onClick={() => setModal('create')}><Plus size={16} className="mr-1" /> Add Category</Button>
      </div>

      <div className="bg-surface rounded overflow-hidden">
        <div className="overflow-x-auto hidden sm:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-bg text-left">
                <th className="p-4 font-medium text-text-muted">Image</th>
                <th className="p-4 font-medium text-text-muted">Name</th>
                <th className="p-4 font-medium text-text-muted">Slug</th>
                <th className="p-4 font-medium text-text-muted">Description</th>
                <th className="p-4 font-medium text-text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat._id} className="border-b border-bg/50 hover:bg-bg/50 transition-colors">
                  <td className="p-4">
                    <div className="w-10 h-10 bg-bg rounded overflow-hidden">
                      {cat.image ? (
                        <img src={cat.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-text-muted">—</div>
                      )}
                    </div>
                  </td>
                  <td className="p-4 font-medium">{cat.name}</td>
                  <td className="p-4 text-text-muted">{cat.slug}</td>
                  <td className="p-4 text-text-muted max-w-[200px] truncate">{cat.description || '—'}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(cat)} className="p-1.5 hover:bg-bg rounded"><Edit3 size={15} /></button>
                      <button onClick={() => handleDelete(cat._id)} className="p-1.5 hover:bg-bg rounded text-error"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="sm:hidden space-y-3 p-4">
          {categories.length === 0 ? (
            <p className="text-center text-text-muted py-8">No categories</p>
          ) : (
            categories.map((cat) => (
              <div key={cat._id} className="border border-bg/50 rounded p-4 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-bg rounded overflow-hidden shrink-0">
                    {cat.image ? (
                      <img src={cat.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-text-muted">—</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{cat.name}</p>
                    <p className="text-xs text-text-muted truncate">{cat.slug}{cat.description ? ` — ${cat.description}` : ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openEdit(cat)} className="p-1.5 hover:bg-bg rounded text-sm flex items-center gap-1"><Edit3 size={14} /> Edit</button>
                  <button onClick={() => handleDelete(cat._id)} className="p-1.5 hover:bg-bg rounded text-error text-sm flex items-center gap-1"><Trash2 size={14} /> Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Modal isOpen={modal === 'create' || modal === 'edit'} onClose={() => { setModal(null); setEditId(null); }} title={modal === 'create' ? 'Add Category' : 'Edit Category'}>
        <div className="space-y-4">
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />

          <div>
            <label className="block text-sm font-medium text-text mb-1">Image</label>
            {image ? (
              <div className="flex items-center gap-3">
                <div className="w-20 h-20 bg-bg rounded overflow-hidden">
                  <img src={image} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex gap-2">
                  <label className="cursor-pointer text-xs text-primary hover:text-primary-dark transition-colors">
                    Change
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                  </label>
                  <button onClick={() => setImage('')} className="text-xs text-error hover:text-red-700 transition-colors">Remove</button>
                </div>
              </div>
            ) : (
              <label className="flex items-center gap-2 w-fit px-4 py-2 border border-dashed border-bg rounded cursor-pointer hover:border-primary/50 transition-colors text-sm text-text-muted">
                {uploading ? (
                  <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-primary" />
                ) : (
                  'Upload Image'
                )}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
              </label>
            )}
          </div>

          <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => { setModal(null); setEditId(null); }}>Cancel</Button>
            <Button onClick={handleSave}>{modal === 'create' ? 'Create' : 'Update'}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CategoryManager;
