
const ZAR_EXCHANGE_RATE = 18.50; // Static exchange rate for demonstration
const PROFIT_MARGIN = 0.15; // 15%
const DUTY_RATE = 0.35; // 35%
const DUTY_BASE_PERCENTAGE = 0.70; // 70%
const TAX_RATE = 0.15; // 15%

export const calculateFinalPrice = (priceUSD: number): { finalUSD: number; finalZAR: number } => {
  const priceWithProfit = priceUSD * (1 + PROFIT_MARGIN);
  const dutyValueBase = priceWithProfit * DUTY_BASE_PERCENTAGE;
  const dutyAmount = dutyValueBase * DUTY_RATE;
  const taxValueBase = priceWithProfit + dutyAmount;
  // FIX: Corrected typo from taxRate to TAX_RATE.
  const taxAmount = taxValueBase * TAX_RATE;

  const finalUSD = priceWithProfit + dutyAmount + taxAmount;
  const finalZAR = finalUSD * ZAR_EXCHANGE_RATE;

  return { finalUSD, finalZAR };
};

export const formatCurrency = (amount: number, currency: 'USD' | 'ZAR') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};
