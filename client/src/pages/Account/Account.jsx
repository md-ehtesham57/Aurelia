import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useGetMyOrdersQuery } from '../../features/orders/orderApi';
import { useGetWishlistQuery, useToggleWishlistMutation, useUpdateMeMutation } from '../../features/auth/authApi';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

const statusVariant = {
  placed: 'primary',
  confirmed: 'primary',
  packed: 'primary',
  shipped: 'accent',
  out_for_delivery: 'accent',
  delivered: 'success',
  cancelled: 'error',
  returned: 'muted',
};

const Account = () => {
  const { user, logout } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get('tab') || 'orders');
  const { data: ordersData, isLoading } = useGetMyOrdersQuery();
  const orders = ordersData?.data?.orders || [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl">My Account</h1>
          <p className="text-text-muted mt-1">{user?.email}</p>
        </div>
        <button
          onClick={logout}
          className="text-sm text-error hover:text-red-700 transition-colors"
        >
          Sign Out
        </button>
      </div>

      <div className="flex gap-6 border-b border-bg mb-6 overflow-x-auto scrollbar-thin">
        {['orders', 'wishlist', 'details'].map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setSearchParams({ tab: t }); }}
            className={`pb-3 text-sm capitalize transition-colors whitespace-nowrap shrink-0 ${
              tab === t
                ? 'text-primary border-b-2 border-primary font-medium'
                : 'text-text-muted hover:text-text'
            }`}
          >
            {t === 'orders' ? 'Order History' : t === 'wishlist' ? 'Wishlist' : 'My Details'}
          </button>
        ))}
      </div>

      {tab === 'orders' && (
        <>
          {isLoading ? (
            <Loader />
          ) : orders.length === 0 ? (
            <p className="text-text-muted text-center py-12">No orders yet</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="bg-surface rounded p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-sm">Order #{order.orderNumber}</span>
                    <Badge variant={statusVariant[order.status] || 'muted'}>
                      {order.status.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                  <p className="text-sm text-text-muted">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm">{order.items.length} item(s)</span>
                    <span className="font-medium text-primary">₹{order.total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'wishlist' && <WishlistTab />}

      {tab === 'details' && <DetailsTab />}
    </div>
  );
};

const DetailsTab = () => {
  const { user } = useAuth();
  const [updateMe, { isLoading }] = useUpdateMeMutation();
  const [editing, setEditing] = useState(false);
  const [newAddress, setNewAddress] = useState({ line1: '', line2: '', city: '', state: '', pincode: '', label: '' });
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');

  const handleSaveProfile = async () => {
    try {
      await updateMe({ name, phone }).unwrap();
      toast.success('Profile updated');
      setEditing(false);
    } catch {
      toast.error('Failed to update profile');
    }
  };

  const handleAddAddress = async () => {
    if (!newAddress.line1 || !newAddress.city || !newAddress.state || !newAddress.pincode) {
      toast.error('Please fill required fields');
      return;
    }
    const addresses = [...(user?.addresses || []), newAddress];
    try {
      await updateMe({ addresses }).unwrap();
      setNewAddress({ line1: '', line2: '', city: '', state: '', pincode: '', label: '' });
      toast.success('Address added');
    } catch {
      toast.error('Failed to add address');
    }
  };

  const handleRemoveAddress = async (index) => {
    const addresses = (user?.addresses || []).filter((_, i) => i !== index);
    try {
      await updateMe({ addresses }).unwrap();
      toast.success('Address removed');
    } catch {
      toast.error('Failed to remove address');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-surface rounded p-4 sm:p-6 space-y-4">
        <h3 className="font-medium">Profile</h3>
        {editing ? (
          <div className="space-y-3">
            <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <p className="text-xs text-text-muted">Email: {user?.email}</p>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSaveProfile} disabled={isLoading}>Save</Button>
              <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2 text-sm">
            <div><span className="text-text-muted">Name:</span> {user?.name}</div>
            <div><span className="text-text-muted">Email:</span> {user?.email}</div>
            <div><span className="text-text-muted">Phone:</span> {user?.phone || '—'}</div>
            <button onClick={() => setEditing(true)} className="text-primary text-xs hover:text-primary-dark transition-colors">Edit</button>
          </div>
        )}
      </div>

      <div className="bg-surface rounded p-4 sm:p-6 space-y-4">
        <h3 className="font-medium">Saved Addresses</h3>
        {(user?.addresses || []).length === 0 ? (
          <p className="text-sm text-text-muted">No saved addresses</p>
        ) : (
          <div className="space-y-3">
            {user.addresses.map((addr, i) => (
              <div key={i} className="text-sm bg-bg rounded p-3 flex justify-between items-start">
                <div>
                  {addr.label && <p className="font-medium text-xs uppercase tracking-wider text-text-muted mb-1">{addr.label}</p>}
                  <p>{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</p>
                  <p>{addr.city}, {addr.state} — {addr.pincode}</p>
                </div>
                <button onClick={() => handleRemoveAddress(i)} className="text-xs text-error hover:text-red-700 transition-colors shrink-0 ml-2">Remove</button>
              </div>
            ))}
          </div>
        )}
        <div className="border-t border-bg pt-4 space-y-3">
          <p className="text-xs font-medium text-text-muted uppercase tracking-wider">Add Address</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input placeholder="Label (e.g. Home)" value={newAddress.label} onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })} />
            <Input placeholder="Address Line 1 *" value={newAddress.line1} onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })} />
            <Input placeholder="Address Line 2" value={newAddress.line2} onChange={(e) => setNewAddress({ ...newAddress, line2: e.target.value })} />
            <Input placeholder="City *" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
            <Input placeholder="State *" value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} />
            <Input placeholder="Pincode *" value={newAddress.pincode} onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })} />
          </div>
          <Button size="sm" onClick={handleAddAddress}>Add Address</Button>
        </div>
      </div>
    </div>
  );
};

const WishlistTab = () => {
  const { data, isLoading } = useGetWishlistQuery();
  const [toggleWishlist] = useToggleWishlistMutation();
  const items = data?.data?.wishlist || [];

  if (isLoading) return <Loader />;

  if (items.length === 0) {
    return <p className="text-text-muted text-center py-12">Your wishlist is empty</p>;
  }

  const handleRemove = async (productId) => {
    try {
      await toggleWishlist(productId).unwrap();
      toast.success('Removed from wishlist');
    } catch {
      toast.error('Failed to remove');
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((product) => (
        <div key={product._id} className="bg-surface rounded overflow-hidden border border-bg/50">
          <Link to={`/products/${product.slug}`} className="block">
            <div className="aspect-square bg-bg overflow-hidden">
              <img
                src={product.images?.[0]?.url || '/placeholder.svg'}
                alt={product.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </Link>
          <div className="p-3 space-y-1">
            <Link to={`/products/${product.slug}`} className="font-serif text-sm font-medium text-text hover:text-primary transition-colors truncate block">
              {product.title}
            </Link>
            <p className="text-xs text-text-muted">
              {product.metal?.purity} {product.metal?.type}
            </p>
            <p className="text-primary font-medium text-sm">
              ₹{(product.priceBreakdown?.total || product.basePriceOverride || 0).toLocaleString('en-IN')}
            </p>
            <button
              onClick={() => handleRemove(product._id)}
              className="text-xs text-error hover:text-red-700 transition-colors mt-1"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Account;
