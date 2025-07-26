import PageTransition from './components/PageTransition.jsx';
import { useDomain } from './contexts/DomainContext';
import Background3D from './components/Background3D';
import { MotionContainer, MotionButton } from './components/MotionElements';
import { motion } from 'framer-motion';

export default function Hero() {
  const { domainData } = useDomain();

  return (    
    <PageTransition>
      <section className="min-h-screen w-full flex flex-col justify-center items-center bg-transparent dark:bg-transparent text-primary dark:text-white-100 relative overflow-hidden">
        <Background3D />
        <MotionContainer>
          <div className="max-w-2xl text-center z-10 relative">
            <motion.h1 
              className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-white drop-shadow-lg dark:text-white-100"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Hi, I'm <span className="text-secondary dark:text-secondary">Shubham Pal</span>
            </motion.h1>
            <motion.div 
              className="flex items-center justify-center gap-2 mb-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <span className="text-2xl text-secondary dark:text-white-100 drop-shadow-md">{domainData.icon}</span>
              <h2 className="text-xl md:text-2xl font-semibold drop-shadow-md text-white dark:text-white-100">
                {domainData.title}
              </h2>
            </motion.div>
            <motion.p 
              className="text-lg md:text-xl mb-8 drop-shadow-md text-white dark:text-white-100"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              {domainData.description}
            </motion.p>
            <MotionButton
              className="inline-block bg-secondary text-primary px-8 py-3 rounded-lg font-semibold shadow-card hover:bg-tertiary hover:text-secondary backdrop-blur-sm"
              onClick={() => window.location.hash = '#projects'}
            >
              View My Work
            </MotionButton>
          </div>
        </MotionContainer>
      </section>
    </PageTransition>
  );
}
