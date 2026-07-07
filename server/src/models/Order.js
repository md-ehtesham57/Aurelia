import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    variantSku: String,
    qty: { type: Number, required: true },
    priceAtPurchase: { type: Number, required: true },
    weightAtPurchase: Number,
  }],
  shippingAddress: {
    line1: String,
    line2: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: 'India' },
  },
  billingAddress: {
    line1: String,
    line2: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: 'India' },
  },
  paymentMethod: { type: String, enum: ['razorpay', 'cod'] },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'],
    default: 'pending',
  },
  paymentTransactionId: String,
  subtotal: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  gst: { type: Number, default: 0 },
  shippingFee: { type: Number, default: 0 },
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: [
      'placed', 'confirmed', 'packed', 'shipped',
      'out_for_delivery', 'delivered', 'cancelled',
      'return_requested', 'returned', 'refunded',
    ],
    default: 'placed',
  },
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    note: String,
  }],
  couponApplied: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },
  giftWrapping: { type: Boolean, default: false },
  giftMessage: String,
}, { timestamps: true });

orderSchema.index({ user: 1 });

const Order = mongoose.model('Order', orderSchema);
export default Order;
