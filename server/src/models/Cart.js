import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  sessionId: { type: String, default: null },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    variantSku: String,
    qty: { type: Number, required: true, min: 1 },
  }],
}, { timestamps: true });

cartSchema.index({ user: 1 });
cartSchema.index({ sessionId: 1 });

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
