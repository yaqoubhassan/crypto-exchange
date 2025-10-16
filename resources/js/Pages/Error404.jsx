import { Link, Head } from '@inertiajs/react';
import { Home, Search, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Error404() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const numberVariants = {
    hidden: { scale: 0.5, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      y: -2,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    tap: {
      scale: 0.98
    }
  };

  return (
    <>
      <Head title="Page Not Found" />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-2xl w-full text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* 404 Illustration */}
          <motion.div
            className="mb-8"
            variants={numberVariants}
          >
            <div className="inline-flex items-center justify-center">
              <motion.span
                className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  backgroundSize: '200% 200%'
                }}
              >
                404
              </motion.span>
            </div>
          </motion.div>

          {/* Main Message */}
          <motion.h1
            className="text-4xl font-bold text-gray-900 mb-4"
            variants={itemVariants}
          >
            Oops! Page Not Found
          </motion.h1>

          <motion.p
            className="text-lg text-gray-600 mb-8 max-w-md mx-auto"
            variants={itemVariants}
          >
            The page you're looking for seems to have wandered off.
            Don't worry, even the best explorers get lost sometimes!
          </motion.p>

          {/* Helpful Suggestions */}
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-6 mb-8 max-w-md mx-auto"
            variants={cardVariants}
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Here's what you can do:
            </h2>
            <ul className="space-y-3 text-left text-gray-600">
              {[
                'Check the URL for any typos',
                'Use the navigation menu to find what you need',
                'Return to the homepage and start fresh'
              ].map((suggestion, index) => (
                <motion.li
                  key={index}
                  className="flex items-start"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.8 + (index * 0.1),
                    duration: 0.4
                  }}
                >
                  <span className="text-blue-500 mr-2">•</span>
                  <span>{suggestion}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            variants={itemVariants}
          >
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-md"
              >
                <Home className="w-5 h-5 mr-2" />
                Go to Homepage
              </Link>
            </motion.div>

            <motion.button
              onClick={() => window.history.back()}
              className="inline-flex items-center px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg shadow-md border border-gray-300"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </motion.button>
          </motion.div>

          {/* Optional: Search or Help Link */}
          <motion.div
            className="mt-8 pt-8 border-t border-gray-200"
            variants={itemVariants}
          >
            <p className="text-sm text-gray-500">
              Need help? {' '}
              <Link
                href="/contact"
                className="text-blue-600 hover:text-blue-700 font-medium underline"
              >
                Contact support
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}