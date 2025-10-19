import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function PricingSection() {
  const fees = [
    {
      category: 'Trading Fees',
      items: [
        { label: 'Maker Fee', value: '0.10%', description: 'When you add liquidity to the order book' },
        { label: 'Taker Fee', value: '0.20%', description: 'When you remove liquidity from the order book' },
        { label: 'VIP Discounts', value: 'Up to 50%', description: 'Reduced fees for high-volume traders' }
      ]
    },
    {
      category: 'Deposit Fees',
      items: [
        { label: 'Crypto Deposits', value: 'FREE', description: 'No fees for cryptocurrency deposits' },
        { label: 'Bank Transfer', value: 'FREE', description: 'Free bank transfers (may vary by region)' },
        { label: 'Credit/Debit Card', value: '3.5%', description: 'Instant deposits with cards' }
      ]
    },
    {
      category: 'Withdrawal Fees',
      items: [
        { label: 'Bitcoin (BTC)', value: '0.0005 BTC', description: 'Network fee for BTC withdrawals' },
        { label: 'Ethereum (ETH)', value: '0.005 ETH', description: 'Network fee for ETH withdrawals' },
        { label: 'Bank Transfer', value: '$25', description: 'Flat fee for fiat withdrawals' }
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Simple, fair pricing with no hidden fees. Trade with confidence knowing exactly what you'll pay.
          </p>
        </motion.div>

        {/* Fee Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {fees.map((section, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
                {section.category}
              </h3>
              <div className="space-y-6">
                {section.items.map((item, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ x: 5 }}
                    className="transition-transform"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-700 font-medium">{item.label}</span>
                      <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        {item.value}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* VIP Program Banner */}
        <motion.div
          className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Join Our VIP Program
          </h3>
          <p className="text-lg text-indigo-100 mb-6 max-w-2xl mx-auto">
            Trade more, pay less. Get up to 50% fee discounts, priority customer support, and exclusive features.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href={route('register')}
              className="inline-flex items-center px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-xl"
            >
              Learn More About VIP
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </motion.div>
        </motion.div>

        {/* Disclaimer */}
        <motion.p
          className="text-center text-sm text-gray-500 mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          * Fees are subject to change. Network fees for cryptocurrency withdrawals vary based on blockchain congestion.
        </motion.p>
      </div>
    </section>
  );
}