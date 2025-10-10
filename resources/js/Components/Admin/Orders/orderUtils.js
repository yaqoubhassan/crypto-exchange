export const getStatusBadge = (status) => {
  const badges = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    partial: 'bg-blue-100 text-blue-800 border-blue-200',
    filled: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-gray-100 text-gray-800 border-gray-200',
    expired: 'bg-red-100 text-red-800 border-red-200',
  };
  return badges[status] || 'bg-gray-100 text-gray-800';
};

export const getSideBadge = (side) => {
  return side === 'buy'
    ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
    : 'bg-rose-100 text-rose-800 border-rose-200';
};

export const getTypeBadge = (type) => {
  const badges = {
    market: 'bg-purple-100 text-purple-800 border-purple-200',
    limit: 'bg-blue-100 text-blue-800 border-blue-200',
    stop: 'bg-orange-100 text-orange-800 border-orange-200',
    stop_limit: 'bg-pink-100 text-pink-800 border-pink-200',
  };
  return badges[type] || 'bg-gray-100 text-gray-800';
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8
  }).format(amount);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDateShort = (date) => {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};