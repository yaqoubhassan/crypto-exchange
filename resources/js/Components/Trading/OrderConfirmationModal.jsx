import React from 'react';

export default function OrderConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  orderDetails,
  loading
}) {
  if (!isOpen) return null;

  const { side, type, quantity, price, crypto, total } = orderDetails;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full animate-fadeIn">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Confirm {side === 'buy' ? 'Buy' : 'Sell'} Order
            </h2>
            {!loading && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Order Type</span>
              <span className="text-sm font-semibold text-gray-900 capitalize">
                {type}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Side</span>
              <span className={`text-sm font-semibold capitalize ${side === 'buy' ? 'text-green-600' : 'text-red-600'
                }`}>
                {side}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Amount</span>
              <span className="text-sm font-semibold text-gray-900">
                {parseFloat(quantity).toFixed(8)} {crypto}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Price</span>
              <span className="text-sm font-semibold text-gray-900">
                ${type === 'market' ? 'Market Price' : parseFloat(price).toFixed(2)}
              </span>
            </div>

            <div className="pt-3 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-base font-medium text-gray-900">Total</span>
                <span className="text-lg font-bold text-gray-900">
                  ${parseFloat(total).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Warning/Info Message */}
          <div className={`rounded-lg p-3 ${side === 'buy' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className={`h-5 w-5 ${side === 'buy' ? 'text-green-600' : 'text-red-600'
                  }`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className={`text-sm ${side === 'buy' ? 'text-green-800' : 'text-red-800'
                  }`}>
                  {side === 'buy'
                    ? `You are about to buy ${parseFloat(quantity).toFixed(8)} ${crypto}.`
                    : `You are about to sell ${parseFloat(quantity).toFixed(8)} ${crypto}.`
                  }
                  {type === 'market' && ' This order will be executed at the current market price.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex space-x-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${side === 'buy'
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-red-600 hover:bg-red-700'
              }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              `Confirm ${side === 'buy' ? 'Buy' : 'Sell'}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}