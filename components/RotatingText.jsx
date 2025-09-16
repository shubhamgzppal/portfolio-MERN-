import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function RotatingText({
  texts = [],
  mainClassName = '',
  rotationInterval = 2000,
  initial = { y: '100%' },
  animate = { y: 0 },
  exit = { y: '-120%' },
  transition = { type: 'spring', damping: 30, stiffness: 400 }
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!texts || texts.length === 0) return;
    const id = setInterval(() => {
      setIndex(i => (i + 1) % texts.length);
    }, rotationInterval);
    return () => clearInterval(id);
  }, [texts, rotationInterval]);

  if (!texts || texts.length === 0) return null;

  return (
    <div className={mainClassName} aria-live="polite">
      <div className="relative overflow-hidden inline-block">
        <AnimatePresence mode="wait">
          <motion.span
            key={index}
            initial={initial}
            animate={animate}
            exit={exit}
            transition={transition}
            className="block"
          >
            {texts[index]}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
