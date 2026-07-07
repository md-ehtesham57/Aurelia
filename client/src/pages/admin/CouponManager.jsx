import { useState } from 'react';
import { useGetCouponsQuery, useCreateCouponMutation } from '../../features/admin/adminApi';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import toast from 'react-hot-toast';

const CouponManager = () => {
  const { data, isLoading } = useGetCouponsQuery();
  const [createCoupon] = useCreateCouponMutation();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({
    code: '', type: 'percentage', value: '', minOrderValue: '0',
    maxDiscount: '', validFrom: '', validTo: '',
  });

  const coupons = data?.data?.coupons || [];

  const handleCreate = async () => {
    try {
      await createCoupon({
        ...form,
        value: Number(form.value),
        minOrderValue: Number(form.minOrderValue),
        maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : undefined,
      }).unwrap();
      toast.success('Coupon created');
      setModal(false);
    } catch {
      toast.error('Failed to create coupon');
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif text-lg">Coupons</h3>
        <Button onClick={() => setModal(true)}>Add Coupon</Button>
      </div>

      <div className="bg-surface rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-bg text-left">
              <th className="p-4 font-medium text-text-muted">Code</th>
              <th className="p-4 font-medium text-text-muted">Type</th>
              <th className="p-4 font-medium text-text-muted">Value</th>
              <th className="p-4 font-medium text-text-muted">Used</th>
              <th className="p-4 font-medium text-text-muted">Status</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon._id} className="border-b border-bg/50 hover:bg-bg/50 transition-colors">
                <td className="p-4 font-medium">{coupon.code}</td>
                <td className="p-4 text-text-muted capitalize">{coupon.type}</td>
                <td className="p-4">
                  {coupon.type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`}
                </td>
                <td className="p-4 text-text-muted">{coupon.usedCount || 0}{coupon.usageLimit ? `/${coupon.usageLimit}` : ''}</td>
                <td className="p-4">
                  <span className={`text-xs ${coupon.isActive ? 'text-success' : 'text-error'}`}>
                    {coupon.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title="Create Coupon">
        <div className="space-y-4">
          <Input label="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-4 py-2.5 bg-bg rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="percentage">Percentage</option>
                <option value="flat">Flat</option>
              </select>
            </div>
            <Input label="Value" type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
          </div>
          <Input label="Min Order Value" type="number" value={form.minOrderValue} onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })} />
          <Input label="Max Discount (optional)" type="number" value={form.maxDiscount} onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Valid From" type="date" value={form.validFrom} onChange={(e) => setForm({ ...form, validFrom: e.target.value })} />
            <Input label="Valid To" type="date" value={form.validTo} onChange={(e) => setForm({ ...form, validTo: e.target.value })} />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setModal(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Create</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CouponManager;
