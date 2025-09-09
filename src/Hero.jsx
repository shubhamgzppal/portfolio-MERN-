import PageTransition from './components/PageTransition.jsx';
// DomainContext removed - showing combined profile
import Background3D from './components/Background3D';
import { MotionContainer, MotionButton } from './components/MotionElements';
import { motion } from 'framer-motion';
import SplitText from './components/SplitText';
import RotatingText from './components/RotatingText';

  const handleAnimationComplete = () => {
    console.log('All letters have animated!');
  };

export default function Hero() {
  const full = { icon: '💻', title: 'Full Stack Developer', description: 'Building modern web applications with React, Node.js and modern tooling.' };
  const data = { icon: '📊', title: 'Data Scientist', description: 'Analyzing data and building ML models to extract insight.' };

  return (    
    <PageTransition>
      <section className="min-h-screen w-full flex flex-col justify-center items-center bg-transparent dark:bg-transparent text-primary dark:text-white-100 relative overflow-hidden">
        <Background3D />
        <MotionContainer>
          <div className="max-w-2xl text-center z-10 relative">
            <SplitText
              text={"Hi, I am Shubham Pal"}
              className="text-5xl md:text-6xl font-bold mb-6 leading-tight text-white drop-shadow-lg dark:text-white-100"
              delay={100}
              duration={0.6}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="center"
              onLetterAnimationComplete={handleAnimationComplete}
            />
            <motion.div 
              className="flex items-center justify-center gap-2 mb-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <span className="text-2xl text-secondary dark:text-white-100 drop-shadow-md">{full.icon}</span>
              <RotatingText
                texts={[full.title, data.title]}
                mainClassName="text-xl md:text-2xl font-semibold drop-shadow-md text-white dark:text-white-100"
                rotationInterval={2200}
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '-120%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 400 }}
              />
            </motion.div>
            <motion.p 
              className="text-lg md:text-xl mb-8 drop-shadow-md text-white dark:text-white-100"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              {full.description} {data.description}
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
