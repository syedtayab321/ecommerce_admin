export const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';

  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

export const formatCurrency = (amount) => {
  if (isNaN(amount) || amount == null) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const calculateDiscount = (total, discountPercentage) => {
  if (isNaN(total) || isNaN(discountPercentage)) {
    return {
      discountAmount: 0,
      finalTotal: total || 0,
    };
  }

  const discountAmount = total * (discountPercentage / 100);
  const finalTotal = total - discountAmount;

  return {
    discountAmount,
    finalTotal,
  };
};

export const validateOrderItems = (items) => {
  if (!Array.isArray(items)) {
    throw new Error('Items must be an array');
  }

  if (items.length === 0) {
    throw new Error('Order must contain at least one item');
  }

  for (const item of items) {
    if (!item.productId) {
      throw new Error('All items must have a productId');
    }

    if (!item.name) {
      throw new Error('All items must have a name');
    }

    if (isNaN(item.price) || item.price <= 0) {
      throw new Error('All items must have a valid price');
    }

    if (isNaN(item.quantity) || item.quantity <= 0) {
      throw new Error('All items must have a valid quantity');
    }
  }

  return true;
};