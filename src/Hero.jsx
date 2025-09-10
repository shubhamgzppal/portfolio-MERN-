import PageTransition from './components/PageTransition.jsx';
import { MotionContainer, MotionButton } from './components/MotionElements';
import { motion } from 'framer-motion';
import SplitText from './components/SplitText';
import RotatingText from './components/RotatingText';
import TextType from './components/TextType';

  const handleAnimationComplete = () => {
    // Animation complete
  };

export default function Hero() {

  const description = ["Full Stack Developer & Data Scientist building modern web apps and extracting insights with ML."]

  return (    
    <PageTransition>
  <section className="min-h-screen w-full flex flex-col justify-center items-center bg-transparent dark:bg-transparent text-primary dark:text-white-100 relative overflow-hidden">
        <MotionContainer>
          <div className="max-w-2xl text-center z-10 relative">
            <SplitText
              text={"Hi, I am Shubham Pal"}
              className="text-5xl md:text-6xl font-bold mb-6 leading-tight drop-shadow-lg"
              delay={100}
              duration={2}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 80 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.4}
              rootMargin="-100px"
              textAlign="center"
              onLetterAnimationComplete={handleAnimationComplete}
            />
              <RotatingText
                texts={["FULL STACK DEVELEOPER", "DATA SCIENTIST"]}
                mainClassName="text-xl md:text-2xl font-semibold drop-shadow-md mb-2"
                rotationInterval={3200}
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '-120%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 400 }}
              />
            
            <motion.p 
              className="text-lg md:text-xl mb-8 drop-shadow-md"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.9 }}
            >
              <TextType 
                text={description}
                typingSpeed={75}
                pauseDuration={1500}
                showCursor={true}
                cursorCharacter="|"
              />
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
