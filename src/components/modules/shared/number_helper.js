export const formatPrice = value => new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'VND',
}).format(value);
