import { motion } from 'framer-motion';

const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        duration: 1, 
        ease: [0.43, 0.13, 0.23, 0.96]
      }}
      className="w-full z-1"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
