import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetCartQuery } from '../features/cart/cartApi';
import { useCreateOrderMutation } from '../features/orders/orderApi';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { data: cartData, isLoading } = useGetCartQuery();
  const [createOrder, { isLoading: isCreating }] = useCreateOrderMutation();

  const [address, setAddress] = useState({
    line1: '', line2: '', city: '', state: '', pincode: '', country: 'India',
  });
  const [paymentMethod, setPaymentMethod] = useState('razorpay');

  const items = cartData?.data?.cart?.items || [];
  const subtotal = items.reduce((sum, item) => sum + (item.product?.basePriceOverride || 0) * item.qty, 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const orderItems = items.map((item) => ({
        product: item.product._id,
        variantSku: item.variantSku,
        qty: item.qty,
      }));

      const result = await createOrder({
        items: orderItems,
        shippingAddress: address,
        paymentMethod,
      }).unwrap();

      toast.success('Order placed successfully!');
      navigate(`/account?order=${result.data.order._id}`);
    } catch (err) {
      toast.error(err.data?.message || 'Failed to place order');
    }
  };

  if (isLoading) return <Loader />;

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-serif text-3xl mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-surface rounded p-6">
            <h3 className="font-serif text-lg mb-4">Shipping Address</h3>
            <div className="space-y-4">
              <Input
                label="Address Line 1"
                value={address.line1}
                onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                required
              />
              <Input
                label="Address Line 2"
                value={address.line2}
                onChange={(e) => setAddress({ ...address, line2: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="City"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  required
                />
                <Input
                  label="State"
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Pincode"
                  value={address.pincode}
                  onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                  required
                />
                <Input label="Country" value="India" disabled />
              </div>
            </div>
          </div>

          <div className="bg-surface rounded p-6">
            <h3 className="font-serif text-lg mb-4">Payment Method</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 border border-bg rounded cursor-pointer hover:bg-bg transition-colors">
                <input
                  type="radio"
                  name="payment"
                  value="razorpay"
                  checked={paymentMethod === 'razorpay'}
                  onChange={() => setPaymentMethod('razorpay')}
                  className="accent-primary"
                />
                <div>
                  <p className="text-sm font-medium">Online Payment</p>
                  <p className="text-xs text-text-muted">UPI, Cards, Netbanking</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 border border-bg rounded cursor-pointer hover:bg-bg transition-colors">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="accent-primary"
                />
                <div>
                  <p className="text-sm font-medium">Cash on Delivery</p>
                  <p className="text-xs text-text-muted">Pay when you receive</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-surface rounded p-6 sticky top-24 space-y-4">
            <h3 className="font-serif text-lg">Order Summary</h3>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span className="text-text-muted truncate mr-2">
                    {item.product?.title} x{item.qty}
                  </span>
                  <span>₹{((item.product?.basePriceOverride || 0) * item.qty).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
            <hr className="border-bg" />
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <Button type="submit" className="w-full" disabled={isCreating}>
              {isCreating ? 'Processing...' : `Place Order`}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
