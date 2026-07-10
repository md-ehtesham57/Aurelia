import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true },
  sku: { type: String, required: true, unique: true },
  description: String,
  shortDescription: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  collectionTags: [{ type: String }],
  images: [{
    url: { type: String, required: true },
    publicId: String,
    altText: String,
    order: { type: Number, default: 0 },
  }],
  metal: {
    type: { type: String, enum: ['gold', 'silver', 'platinum'] },
    purity: String,
    color: { type: String, enum: ['yellow', 'rose', 'white'] },
  },
  weightGrams: { type: Number },
  makingChargeType: { type: String, enum: ['flat', 'percentage'] },
  makingChargeValue: { type: Number },
  gemstones: [{
    type: String,
    caratWeight: Number,
    clarity: String,
    color: String,
  }],
  diamondDetails: {
    caratWeight: Number,
    clarity: String,
    color: String,
    certification: { type: String, enum: ['GIA', 'IGI', 'None'] },
  },
  gemstoneCost: { type: Number },
  basePriceOverride: { type: Number },
  variants: [{
    size: String,
    weightGrams: Number,
    sku: String,
    stock: { type: Number, default: 0 },
  }],
  gender: { type: String, enum: ['women', 'men', 'kids', 'unisex'] },
  occasion: [{ type: String }],
  status: {
    type: String,
    enum: ['draft', 'published', 'hidden', 'out_of_stock', 'archived'],
    default: 'draft',
  },
  ratingAverage: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  seo: {
    metaTitle: String,
    metaDescription: String,
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

productSchema.index({ status: 1, category: 1 });
productSchema.index({ title: 'text', description: 'text' });

productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
