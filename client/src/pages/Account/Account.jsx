import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useGetMyOrdersQuery } from '../../features/orders/orderApi';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';

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
  const [tab, setTab] = useState('orders');
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
            onClick={() => setTab(t)}
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

      {tab === 'wishlist' && (
        <p className="text-text-muted text-center py-12">Your wishlist is empty</p>
      )}

      {tab === 'details' && (
        <div className="bg-surface rounded p-4 sm:p-6 space-y-3">
          <div><span className="text-sm text-text-muted">Name:</span> <span className="text-sm">{user?.name}</span></div>
          <div><span className="text-sm text-text-muted">Email:</span> <span className="text-sm">{user?.email}</span></div>
          {user?.phone && <div><span className="text-sm text-text-muted">Phone:</span> <span className="text-sm">{user.phone}</span></div>}
        </div>
      )}
    </div>
  );
};

export default Account;
