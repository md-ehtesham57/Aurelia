import mongoose from 'mongoose';

const goldRateConfigSchema = new mongoose.Schema({
  metalType: { type: String, required: true, enum: ['gold', 'silver', 'platinum'] },
  purity: { type: String, required: true },
  ratePerGram: { type: Number, required: true },
  effectiveDate: { type: Date, default: Date.now },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const GoldRateConfig = mongoose.model('GoldRateConfig', goldRateConfigSchema);
export default GoldRateConfig;
