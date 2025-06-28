export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const getPaymentMethodIcon = (method) => {
  const icons = {
    credit_card: '💳',
    paypal: '🔵',
    apple_pay: '',
    google_pay: 'G',
    bank_transfer: '🏦',
  };
  return icons[method] || '💰';
};