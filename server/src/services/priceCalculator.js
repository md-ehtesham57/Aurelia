import GoldRateConfig from '../models/GoldRateConfig.js';

const GST_RATE = 0.03;

function computePrice(product, rateConfig) {
  if (product.basePriceOverride) {
    return {
      basePrice: product.basePriceOverride,
      metalValue: 0,
      makingCharges: 0,
      gst: Math.round(product.basePriceOverride * GST_RATE),
      total: Math.round(product.basePriceOverride * (1 + GST_RATE)),
    };
  }

  const metalValue = (product.weightGrams || 0) * (rateConfig?.ratePerGram || 0);

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
    ratePerGram: rateConfig?.ratePerGram || null,
    purity: product.metal?.purity || null,
  };
}

export const calculateProductPrice = async (product) => {
  if (product.basePriceOverride) {
    return computePrice(product, null);
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

  return computePrice(product, rateConfig);
};

export async function bulkCalculatePrices(products) {
  if (!products.length) return [];

  const keys = new Set();
  products.forEach((p) => {
    if (!p.basePriceOverride && p.metal?.type) {
      keys.add(`${p.metal.type}:${p.metal.purity || '22K'}`);
    }
  });

  const rateMap = {};
  if (keys.size) {
    const orConditions = [];
    keys.forEach((k) => {
      const [metalType, purity] = k.split(':');
      orConditions.push({ metalType, purity });
    });
    const rates = await GoldRateConfig.find({ $or: orConditions }).sort({ effectiveDate: -1 });
    for (const r of rates) {
      const k = `${r.metalType}:${r.purity}`;
      if (!rateMap[k]) rateMap[k] = r;
    }
  }

  return products.map((product) => {
    const key = product.metal?.type ? `${product.metal.type}:${product.metal.purity || '22K'}` : null;
    const rateConfig = key ? rateMap[key] : null;
    return { ...computePrice(product, rateConfig), productId: product._id };
  });
}

export const calculateCartTotal = async (cartItems, products) => {
  const priceBreakdowns = await bulkCalculatePrices(products);
  let subtotal = 0;
  const calculatedItems = [];

  for (let i = 0; i < cartItems.length; i++) {
    const item = cartItems[i];
    const product = products.find(
      (p) => p._id.toString() === (item.product?._id?.toString() || item.product.toString()),
    );
    if (!product) continue;

    const pd = priceBreakdowns.find((p) => p.productId.toString() === product._id.toString());
    const itemTotal = (pd?.total || 0) * item.qty;
    subtotal += itemTotal;

    calculatedItems.push({
      product: product._id,
      variantSku: item.variantSku,
      qty: item.qty,
      priceAtPurchase: pd?.total || 0,
      weightAtPurchase: product.weightGrams,
    });
  }

  return { calculatedItems, subtotal };
};
