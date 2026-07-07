import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  title: String,
  image: { type: String, required: true },
  linkUrl: String,
  position: {
    type: String,
    enum: ['homepage_hero', 'homepage_strip', 'category_top'],
    required: true,
  },
  sortOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Banner = mongoose.model('Banner', bannerSchema);
export default Banner;
