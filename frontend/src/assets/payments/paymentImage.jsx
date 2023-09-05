const IMAGES = {
  Paypal: new URL('./checkout/paypal.webp', import.meta.url).href,
  CreditCard: new URL('./checkout/credit_card.webp', import.meta.url).href,
  Cash: new URL('./checkout/cash.webp', import.meta.url).href,
  visa: new URL('./visa.webp', import.meta.url).href,
  mastercard: new URL('./mastercard.webp', import.meta.url).href,
  american_express: new URL('./american_express.webp', import.meta.url).href,
};

// eslint-disable-next-line react-refresh/only-export-components
export default IMAGES;
