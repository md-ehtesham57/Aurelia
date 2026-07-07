import GoldRateConfig from '../models/GoldRateConfig.js';

const GST_RATE = 0.03;

export const calculateProductPrice = async (product) => {
  if (product.basePriceOverride) {
    return {
      basePrice: product.basePriceOverride,
      metalValue: 0,
      makingCharges: 0,
      gst: Math.round(product.basePriceOverride * GST_RATE),
      total: Math.round(product.basePriceOverride * (1 + GST_RATE)),
    };
  }

  const metal = product.metal?.type || 'gold';
  const purity = product.metal?.purity || '22K';

  const rateConfig = await GoldRateConfig.findOne({
    metalType: metal,
    purity,
  }).sort({ effectiveDate: -1 });

  if (!rateConfig) {
    throw new Error(`No gold rate configured for ${metal} ${purity}`);
  }

  const metalValue = (product.weightGrams || 0) * rateConfig.ratePerGram;

  let makingCharges = 0;
  if (product.makingChargeType === 'flat') {
    makingCharges = product.makingChargeValue || 0;
  } else if (product.makingChargeType === 'percentage') {
    makingCharges = Math.round(metalValue * ((product.makingChargeValue || 0) / 100));
  }

  const basePrice = metalValue + makingCharges;
  const gst = Math.round(basePrice * GST_RATE);
  const total = basePrice + gst;

  return {
    metalValue: Math.round(metalValue),
    makingCharges,
    gst,
    total,
    ratePerGram: rateConfig.ratePerGram,
    purity,
  };
};

export const calculateCartTotal = async (cartItems, products) => {
  let subtotal = 0;
  const calculatedItems = [];

  for (let i = 0; i < cartItems.length; i++) {
    const item = cartItems[i];
    const product = products.find(
      (p) => p._id.toString() === (item.product?._id?.toString() || item.product.toString()),
    );

    if (!product) continue;

    const priceBreakdown = await calculateProductPrice(product);
    const itemTotal = priceBreakdown.total * item.qty;
    subtotal += itemTotal;

    calculatedItems.push({
      product: product._id,
      variantSku: item.variantSku,
      qty: item.qty,
      priceAtPurchase: priceBreakdown.total,
      weightAtPurchase: product.weightGrams,
    });
  }

  return { calculatedItems, subtotal };
};
