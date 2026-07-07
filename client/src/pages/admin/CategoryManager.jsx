import { useState } from 'react';
import { Plus, Edit3, Trash2 } from 'lucide-react';
import { useGetCategoriesQuery, useCreateCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation } from '../../features/admin/adminApi';
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
  const [modal, setModal] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const categories = data?.data?.categories || [];

  const handleCreate = async () => {
    try {
      await createCategory({ name, description }).unwrap();
      toast.success('Category created');
      setModal(null);
      setName('');
      setDescription('');
    } catch {
      toast.error('Failed to create category');
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
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif text-lg">Categories</h3>
        <Button onClick={() => setModal('create')}><Plus size={16} className="mr-1" /> Add Category</Button>
      </div>

      <div className="bg-surface rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-bg text-left">
              <th className="p-4 font-medium text-text-muted">Name</th>
              <th className="p-4 font-medium text-text-muted">Slug</th>
              <th className="p-4 font-medium text-text-muted">Description</th>
              <th className="p-4 font-medium text-text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat._id} className="border-b border-bg/50 hover:bg-bg/50 transition-colors">
                <td className="p-4 font-medium">{cat.name}</td>
                <td className="p-4 text-text-muted">{cat.slug}</td>
                <td className="p-4 text-text-muted">{cat.description || '—'}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 hover:bg-bg rounded"><Edit3 size={15} /></button>
                    <button onClick={() => handleDelete(cat._id)} className="p-1.5 hover:bg-bg rounded text-error"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modal === 'create'} onClose={() => setModal(null)} title="Add Category">
        <div className="space-y-4">
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setModal(null)}>Cancel</Button>
            <Button onClick={handleCreate}>Create</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CategoryManager;
