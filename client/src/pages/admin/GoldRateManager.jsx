import { useState } from 'react';
import { useGetGoldRatesQuery, useUpdateGoldRateMutation } from '../../features/admin/adminApi';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

const GoldRateManager = () => {
  const { data, isLoading } = useGetGoldRatesQuery();
  const [updateGoldRate] = useUpdateGoldRateMutation();
  const [form, setForm] = useState({ metalType: 'gold', purity: '22K', ratePerGram: '' });
  const rates = data?.data?.rates || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateGoldRate({
        metalType: form.metalType,
        purity: form.purity,
        ratePerGram: Number(form.ratePerGram),
      }).unwrap();
      toast.success('Gold rate updated');
      setForm({ ...form, ratePerGram: '' });
    } catch {
      toast.error('Failed to update rate');
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
      <div className="bg-surface rounded p-4 sm:p-6">
        <h3 className="font-serif text-base sm:text-lg mb-4">Set Gold Rate</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium">Metal</label>
              <select
                value={form.metalType}
                onChange={(e) => setForm({ ...form, metalType: e.target.value })}
                className="w-full px-4 py-2.5 bg-bg rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="gold">Gold</option>
                <option value="silver">Silver</option>
                <option value="platinum">Platinum</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium">Purity</label>
              <select
                value={form.purity}
                onChange={(e) => setForm({ ...form, purity: e.target.value })}
                className="w-full px-4 py-2.5 bg-bg rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="9K">9K</option>
                <option value="14K">14K</option>
                <option value="18K">18K</option>
                <option value="22K">22K</option>
                <option value="24K">24K</option>
              </select>
            </div>
          </div>
          <Input
            label="Rate per Gram (₹)"
            type="number"
            value={form.ratePerGram}
            onChange={(e) => setForm({ ...form, ratePerGram: e.target.value })}
            required
          />
          <Button type="submit">Update Rate</Button>
        </form>
      </div>

      <div className="bg-surface rounded p-4 sm:p-6">
        <h3 className="font-serif text-base sm:text-lg mb-4">Rate History</h3>
        {rates.length === 0 ? (
          <p className="text-sm text-text-muted">No rates recorded yet</p>
        ) : (
          <div className="space-y-2">
            {rates.map((rate) => (
              <div key={rate._id} className="flex items-center justify-between text-sm py-2 border-b border-bg/50 last:border-0">
                <div>
                  <span className="capitalize">{rate.metalType}</span> - {rate.purity}
                </div>
                <div className="text-right">
                  <p className="font-medium">₹{rate.ratePerGram}/g</p>
                  <p className="text-xs text-text-muted">
                    {new Date(rate.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GoldRateManager;
