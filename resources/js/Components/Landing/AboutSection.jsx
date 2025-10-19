import { motion } from 'framer-motion';

export default function AboutSection() {
  const stats = [
    { value: '2019', label: 'Founded', icon: '📅' },
    { value: '150+', label: 'Team Members', icon: '👥' },
    { value: '180+', label: 'Countries', icon: '🌍' },
    { value: '$50B+', label: 'Traded Volume', icon: '💰' }
  ];

  const values = [
    {
      icon: '🔒',
      title: 'Security First',
      description: 'Bank-level security with multi-layer encryption and cold storage for your assets.'
    },
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Execute trades in milliseconds with our high-performance matching engine.'
    },
    {
      icon: '🤝',
      title: 'Customer Focused',
      description: '24/7 multilingual support team ready to assist you anytime, anywhere.'
    },
    {
      icon: '🌟',
      title: 'Innovation Driven',
      description: 'Constantly evolving with cutting-edge technology and new features.'
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
            About CryptoExchange
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're on a mission to make cryptocurrency trading accessible, secure, and simple for everyone around the world.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              className="text-center p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl"
            >
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Story */}
        <motion.div
          className="mb-16 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="prose prose-lg mx-auto text-gray-600">
            <p className="text-lg leading-relaxed mb-4">
              Founded in 2019, CryptoExchange started with a simple vision: to create the world's most trusted and user-friendly cryptocurrency exchange platform.
            </p>
            <p className="text-lg leading-relaxed">
              Today, we serve millions of users across 180+ countries, processing billions in trading volume daily. Our commitment to security, innovation, and customer satisfaction drives everything we do.
            </p>
          </div>
        </motion.div>

        {/* Values Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {values.map((value, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="text-center p-6 rounded-2xl hover:shadow-xl transition-shadow"
            >
              <motion.div
                className="text-5xl mb-4"
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {value.icon}
              </motion.div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {value.title}
              </h3>
              <p className="text-gray-600">
                {value.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}