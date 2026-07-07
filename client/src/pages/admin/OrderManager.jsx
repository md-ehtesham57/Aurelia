import { useState } from 'react';
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from '../../features/orders/orderApi';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

const statusColors = {
  placed: 'primary',
  confirmed: 'primary',
  packed: 'primary',
  shipped: 'accent',
  out_for_delivery: 'accent',
  delivered: 'success',
  cancelled: 'error',
  return_requested: 'error',
  returned: 'muted',
  refunded: 'muted',
};

const nextStatuses = {
  placed: ['confirmed', 'cancelled'],
  confirmed: ['packed', 'cancelled'],
  packed: ['shipped', 'cancelled'],
  shipped: ['out_for_delivery'],
  out_for_delivery: ['delivered'],
  delivered: ['return_requested'],
  return_requested: ['returned', 'refunded'],
};

const OrderManager = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const { data, isLoading } = useGetAllOrdersQuery({ status: statusFilter || undefined });
  const [updateStatus] = useUpdateOrderStatusMutation();
  const [expanded, setExpanded] = useState(null);

  const orders = data?.data?.orders || [];

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateStatus({ id, status }).unwrap();
      toast.success('Order updated');
    } catch {
      toast.error('Failed to update order');
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-sm bg-surface border border-bg rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="">All Orders</option>
          {Object.keys(statusColors).map((s) => (
            <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-surface rounded">
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-bg/50 transition-colors"
              onClick={() => setExpanded(expanded === order._id ? null : order._id)}
            >
              <div className="flex items-center gap-4">
                <span className="font-medium">#{order.orderNumber}</span>
                <Badge variant={statusColors[order.status]}>{order.status.replace(/_/g, ' ')}</Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-text-muted">
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                <span className="font-medium text-text">₹{order.total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {expanded === order._id && (
              <div className="border-t border-bg p-4 space-y-3">
                <div className="text-sm">
                  <p><span className="text-text-muted">Customer:</span> {order.user?.name || 'Guest'} ({order.user?.email})</p>
                  <p><span className="text-text-muted">Payment:</span> {order.paymentMethod} — {order.paymentStatus}</p>
                  <p><span className="text-text-muted">Items:</span> {order.items?.length}</p>
                </div>

                <div className="flex items-center gap-2">
                  {(nextStatuses[order.status] || []).map((ns) => (
                    <button
                      key={ns}
                      onClick={() => handleStatusUpdate(order._id, ns)}
                      className="text-xs px-3 py-1.5 rounded border border-bg hover:bg-bg transition-colors capitalize"
                    >
                      Mark as {ns.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        {orders.length === 0 && (
          <p className="text-center text-text-muted py-12">No orders found</p>
        )}
      </div>
    </div>
  );
};

export default OrderManager;
