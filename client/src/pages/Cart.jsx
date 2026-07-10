import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useGetCartQuery, useUpdateCartItemMutation, useRemoveCartItemMutation } from '../features/cart/cartApi';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

const Cart = () => {
  const { data, isLoading } = useGetCartQuery();
  const [updateItem] = useUpdateCartItemMutation();
  const [removeItem] = useRemoveCartItemMutation();
  const cart = data?.data?.cart;
  const items = cart?.items || [];

  const handleQtyChange = async (itemId, newQty) => {
    try {
      await updateItem({ itemId, qty: newQty }).unwrap();
    } catch {
      toast.error('Failed to update cart');
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await removeItem(itemId).unwrap();
      toast.success('Item removed');
    } catch {
      toast.error('Failed to remove item');
    }
  };

  const subtotal = cart?.subtotal || items.reduce((sum, item) => sum + ((item.computedPrice || item.product?.basePriceOverride || 0) * item.qty), 0);

  if (isLoading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto px-fluid-4 py-fluid-8">
      <h1 className="font-serif text-2xl sm:text-3xl mb-fluid-6 sm:mb-fluid-8">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-fluid-20">
          <ShoppingBag size={48} className="mx-auto text-text-muted mb-fluid-4" />
          <p className="text-text-muted mb-fluid-6">Your cart is empty</p>
          <Link to="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-fluid-8">
          <div className="lg:col-span-2 space-y-fluid-4">
            {items.map((item) => (
              <div key={item._id} className="flex flex-col xs:flex-row gap-fluid-4 bg-surface rounded p-fluid-4">
                <div className="w-full xs:w-24 h-32 xs:h-24 bg-bg rounded overflow-hidden shrink-0">
                  <img
                    src={item.product?.images?.[0]?.url || '/placeholder.svg'}
                    alt={item.product?.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Link to={`/products/${item.product?.slug}`} className="font-serif text-lg hover:text-primary transition-colors line-clamp-1">
                    {item.product?.title}
                  </Link>
                  <p className="text-sm text-text-muted mt-1">
                    {item.product?.metal?.purity} {item.product?.metal?.type}
                  </p>
                  <p className="text-primary font-medium mt-1">
                    ₹{((item.computedPrice || item.product?.basePriceOverride || 0) * item.qty).toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="flex flex-row xs:flex-col items-center xs:items-end justify-between xs:justify-start gap-fluid-3">
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="p-2.5 hover:bg-bg rounded transition-colors flex items-center justify-center"
                  >
                    <Trash2 size={16} className="text-text-muted" />
                  </button>
                  <div className="flex items-center border border-bg rounded">
                    <button
                      onClick={() => handleQtyChange(item._id, Math.max(1, item.qty - 1))}
                      className="p-2.5 hover:bg-bg transition-colors flex items-center justify-center"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-3 text-sm min-w-[1.5rem] text-center">{item.qty}</span>
                    <button
                      onClick={() => handleQtyChange(item._id, item.qty + 1)}
                      className="p-2.5 hover:bg-bg transition-colors flex items-center justify-center"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-surface rounded p-fluid-6 h-fit space-y-fluid-4">
            <h3 className="font-serif text-lg">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Shipping</span>
                <span>{subtotal > 500 ? 'Free' : '₹50'}</span>
              </div>
              <hr className="border-bg" />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>₹{(subtotal + (subtotal > 500 ? 0 : 50)).toLocaleString('en-IN')}</span>
              </div>
            </div>
            <Link to="/checkout">
              <Button className="w-full">Proceed to Checkout</Button>
            </Link>
            <Link to="/products" className="flex items-center justify-center gap-1 text-sm text-text-muted hover:text-text transition-colors">
              <ArrowLeft size={14} />
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
