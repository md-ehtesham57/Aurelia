import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetCartQuery } from '../features/cart/cartApi';
import { useCreateOrderMutation } from '../features/orders/orderApi';
import { useApplyCouponMutation } from '../features/admin/adminApi';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { data: cartData, isLoading } = useGetCartQuery();
  const [createOrder, { isLoading: isCreating }] = useCreateOrderMutation();
  const [applyCoupon] = useApplyCouponMutation();

  const [address, setAddress] = useState({
    line1: '', line2: '', city: '', state: '', pincode: '', country: 'India',
  });
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponError, setCouponError] = useState('');

  const cart = cartData?.data?.cart;
  const items = cart?.items || [];
  const subtotal = cart?.subtotal || items.reduce((sum, item) => sum + ((item.computedPrice || item.product?.basePriceOverride || 0) * item.qty), 0);
  const taxableAmount = subtotal - discount;
  const gst = Math.round(taxableAmount * 0.03);
  const shippingFee = taxableAmount > 500 ? 0 : 50;
  const total = taxableAmount + gst + shippingFee;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponError('');
    try {
      const result = await applyCoupon({ code: couponCode }).unwrap();
      setDiscount(result.data.coupon.discount);
      setAppliedCoupon(couponCode.toUpperCase());
      toast.success(`Coupon applied! You save ₹${result.data.coupon.discount.toLocaleString('en-IN')}`);
    } catch (err) {
      setCouponError(err.data?.message || 'Invalid coupon');
      setDiscount(0);
      setAppliedCoupon('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await createOrder({
        shippingAddress: address,
        paymentMethod,
        couponCode: appliedCoupon || undefined,
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
    <div className="max-w-7xl mx-auto px-fluid-4 py-fluid-8">
      <h1 className="font-serif text-2xl sm:text-3xl mb-fluid-6 sm:mb-fluid-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-5 gap-fluid-8">
        <div className="lg:col-span-3 space-y-fluid-6">
          <div className="bg-surface rounded p-fluid-4 sm:p-fluid-6">
            <h3 className="font-serif text-lg mb-fluid-4">Shipping Address</h3>
            <div className="space-y-fluid-4">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-fluid-4">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-fluid-4">
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

          <div className="bg-surface rounded p-fluid-4 sm:p-fluid-6">
            <h3 className="font-serif text-lg mb-fluid-4">Payment Method</h3>
            <div className="space-y-fluid-3">
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
          <div className="bg-surface rounded p-fluid-4 sm:p-fluid-6 lg:sticky lg:top-24 space-y-fluid-4">
            <h3 className="font-serif text-lg">Order Summary</h3>
            <div className="space-y-fluid-3">
              {items.map((item) => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span className="text-text-muted truncate mr-2">
                    {item.product?.title} x{item.qty}
                  </span>
                  <span>₹{((item.computedPrice || item.product?.basePriceOverride || 0) * item.qty).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Coupon code"
                  className="flex-1 min-w-0 bg-bg border border-bg rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <Button type="button" size="sm" onClick={handleApplyCoupon} disabled={!!appliedCoupon}>
                  {appliedCoupon ? 'Applied' : 'Apply'}
                </Button>
              </div>
              {couponError && <p className="text-xs text-error">{couponError}</p>}
              {appliedCoupon && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">{appliedCoupon}</span>
                  <span className="text-green-600">-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>

            <hr className="border-bg" />
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-text-muted">Discount</span>
                  <span className="text-green-600">-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-text-muted">GST (3%)</span>
                <span>₹{gst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Shipping</span>
                <span>{shippingFee === 0 ? 'Free' : `₹${shippingFee.toLocaleString('en-IN')}`}</span>
              </div>
            </div>
            <hr className="border-bg" />
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>₹{total.toLocaleString('en-IN')}</span>
            </div>
            <Button type="submit" className="w-full text-sm sm:text-base" disabled={isCreating}>
              {isCreating ? 'Processing...' : `Place Order — ₹${total.toLocaleString('en-IN')}`}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
