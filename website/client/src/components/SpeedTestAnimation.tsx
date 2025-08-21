import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SpeedTestAnimationProps {
  isActive: boolean;
}

const SpeedTestAnimation = ({ isActive }: SpeedTestAnimationProps) => {
  const [step, setStep] = useState(1);
  
  // Cycle through animation steps
  useEffect(() => {
    if (!isActive) {
      setStep(1);
      return;
    }
    
    const interval = setInterval(() => {
      setStep(prev => (prev < 4 ? prev + 1 : 1));
    }, 2000);
    
    return () => clearInterval(interval);
  }, [isActive]);
  
  if (!isActive) return null;
  
  return (
    <div className="relative h-40 w-full overflow-hidden rounded-lg bg-soft-cream mb-4">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="flex items-center">
              <motion.div 
                className="w-16 h-16 bg-vibe-yellow rounded-full flex items-center justify-center"
                initial={{ x: -80 }}
                animate={{ x: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 150, 
                  damping: 15 
                }}
              >
                <span className="text-2xl">☕</span>
              </motion.div>
              
              <motion.div
                className="w-16 h-16 bg-tech-blue rounded-full flex items-center justify-center ml-6"
                initial={{ x: 80 }}
                animate={{ x: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 150, 
                  damping: 15,
                  delay: 0.2
                }}
              >
                <span className="text-2xl">💻</span>
              </motion.div>
            </div>
          </motion.div>
        )}
        
        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="relative">
              <motion.div 
                className="w-16 h-16 bg-vibe-yellow rounded-full flex items-center justify-center"
                animate={{ 
                  x: [0, 50, 0],
                  rotate: [0, 10, 0]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <span className="text-2xl">☕</span>
              </motion.div>
              
              <motion.div 
                className="absolute top-0 left-20 w-16 h-16 bg-tech-blue rounded-full flex items-center justify-center z-10"
                animate={{ 
                  y: [0, -20, 0],
                }}
                transition={{ 
                  duration: 1,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: 0.5
                }}
              >
                <span className="text-2xl">💻</span>
              </motion.div>
              
              <motion.div 
                className="absolute top-6 left-10 text-sm font-bold"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Testing...
              </motion.div>
            </div>
          </motion.div>
        )}
        
        {step === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="flex items-center gap-2 relative">
              <motion.div 
                className="w-16 h-16 bg-vibe-yellow rounded-full flex items-center justify-center"
                animate={{ 
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  duration: 0.8,
                  repeat: Infinity,
                }}
              >
                <span className="text-2xl">☕</span>
              </motion.div>
              
              <motion.div
                className="absolute left-10 top-0 h-2 w-20 bg-tech-blue opacity-75 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: 80 }}
                transition={{ duration: 1.5 }}
              />
              
              <motion.div 
                className="w-16 h-16 bg-tech-blue rounded-full flex items-center justify-center"
                initial={{ x: 80 }}
                animate={{ 
                  x: 0,
                  rotate: 360
                }}
                transition={{ 
                  type: "spring",
                  damping: 10,
                  duration: 1.5
                }}
              >
                <span className="text-2xl">💻</span>
              </motion.div>
            </div>
          </motion.div>
        )}
        
        {step === 4 && (
          <motion.div 
            key="step4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <motion.div className="relative">
              <motion.div 
                className="flex items-center justify-center space-x-3"
                animate={{ y: [0, -10, 0] }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                }}
              >
                <motion.div 
                  className="w-16 h-16 bg-vibe-yellow rounded-full flex items-center justify-center"
                  animate={{ rotate: [-5, 5, -5] }}
                  transition={{ 
                    duration: 1,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <span className="text-2xl">☕</span>
                </motion.div>
                
                <motion.div 
                  className="w-16 h-16 bg-tech-blue rounded-full flex items-center justify-center"
                  animate={{ rotate: [5, -5, 5] }}
                  transition={{ 
                    duration: 1,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <span className="text-2xl">💻</span>
                </motion.div>
              </motion.div>
              
              <motion.div 
                className="text-center mt-4 font-medium text-tech-blue"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Almost there...
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SpeedTestAnimation;