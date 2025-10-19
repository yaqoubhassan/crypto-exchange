import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function SupportSection() {
  const supportChannels = [
    {
      icon: '💬',
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      availability: '24/7',
      cta: 'Start Chat',
      href: '#'
    },
    {
      icon: '📧',
      title: 'Email Support',
      description: 'Send us a detailed message',
      availability: 'Response within 24h',
      cta: 'Send Email',
      href: 'mailto:support@cryptoexchange.com'
    },
    {
      icon: '📚',
      title: 'Help Center',
      description: 'Browse articles and guides',
      availability: 'Self-service',
      cta: 'Visit Help Center',
      href: '#'
    },
    {
      icon: '🎓',
      title: 'Academy',
      description: 'Learn about crypto trading',
      availability: 'Free courses',
      cta: 'Start Learning',
      href: '#'
    }
  ];

  const faqs = [
    {
      question: 'How do I create an account?',
      answer: 'Click "Get Started" and follow the simple registration process. You\'ll need to verify your email and complete KYC verification.'
    },
    {
      question: 'Is my money safe?',
      answer: 'Yes! We use bank-level security with multi-layer encryption, cold storage for 95% of funds, and regular security audits.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept bank transfers, credit/debit cards, and cryptocurrency deposits from external wallets.'
    },
    {
      question: 'How long do withdrawals take?',
      answer: 'Crypto withdrawals are typically processed within 30 minutes. Bank transfers take 1-3 business days depending on your location.'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="py-16 md:py-24 bg-white">
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
            We're Here to Help
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            24/7 multilingual support team ready to assist you with any questions or issues.
          </p>
        </motion.div>

        {/* Support Channels Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {supportChannels.map((channel, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl border border-gray-200 hover:border-indigo-300 hover:shadow-xl transition-all"
            >
              <motion.div
                className="text-5xl mb-4"
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {channel.icon}
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {channel.title}
              </h3>
              <p className="text-gray-600 text-sm mb-3">
                {channel.description}
              </p>
              <div className="text-xs text-indigo-600 font-semibold mb-4">
                {channel.availability}
              </div>
              <motion.a
                href={channel.href}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block w-full text-center px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                {channel.cta}
              </motion.a>
            </motion.div>
          ))}
        </motion.div>

        {/* FAQs */}
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h3>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all"
              >
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  {faq.question}
                </h4>
                <p className="text-gray-600">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p className="text-gray-600 mb-4">
            Still have questions? Our support team is always here to help.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href={route('register')}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-xl"
            >
              Contact Support Team
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}