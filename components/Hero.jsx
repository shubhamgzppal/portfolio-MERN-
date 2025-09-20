import PageTransition from './PageTransition.jsx';
import { MotionContainer, MotionButton } from './MotionElements.jsx';
import { motion } from 'framer-motion';
import SplitText from './SplitText.jsx';
import RotatingText from './RotatingText.jsx';
import TextType from './TextType.jsx';
import LogoLoop from './LogoLoop.jsx';
import { SiReact, SiNodedotjs, SiExpress, SiMongodb, SiJavascript, SiTailwindcss, SiGit, SiPython, SiTensorflow, SiMysql, SiPandas, SiNumpy, SiScikitlearn } from 'react-icons/si';

  const techLogos = [
  { node: <SiReact />, title: "React.js", href: "https://react.dev" },
  { node: <SiNodedotjs />, title: "Node.js", href: "https://nodejs.org" },
  { node: <SiExpress />, title: "Express.js", href: "https://expressjs.com" },
  { node: <SiMongodb />, title: "MongoDB", href: "https://www.mongodb.com/" },
  { node: <SiJavascript />, title: "JavaScript", href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
  { node: <SiTailwindcss />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
  { node: <SiGit />, title: "Git", href: "https://git-scm.com/" },
  { node: <SiPython />, title: "Python", href: "https://www.python.org/" },
  { node: <SiTensorflow />, title: "Machine Learning", href: "https://www.tensorflow.org/" },
  { node: <SiPython />, title: "Data Analysis", href: "https://www.python.org/" },
  { node: <SiMysql />, title: "SQL", href: "https://www.mysql.com/" },
  { node: <SiPandas />, title: "Pandas", href: "https://pandas.pydata.org/" },
  { node: <SiNumpy />, title: "NumPy", href: "https://numpy.org/" },
  { node: <SiScikitlearn />, title: "Scikit-learn", href: "https://scikit-learn.org/" },
];

 
export default function Hero() {

  const description = ["Full Stack Developer & Data Scientist building modern web apps and extracting insights with ML."]

  return (    
    <PageTransition>
  <section className="min-h-[80vh] flex flex-col justify-center items-center bg-transparent dark:bg-transparent text-primary dark:text-white-100 relative overflow-hidden">
        <MotionContainer>
          <div className="max-w-2xl text-center relative">
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
            />
              <RotatingText
                texts={["FULL STACK DEVELEOPER", "DATA SCIENTIST"]}
                mainClassName="text-xl md:text-2xl font-bold drop-shadow-md mb-2"
                rotationInterval={3200}
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '-120%' }}
                transition={{ type: 'spring', damping: 80, stiffness: 600 }}
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
      <div className='relative overflow-hidden w-full flex items-center'>
          <LogoLoop
            logos={techLogos}
            speed={120}
            direction="left"
            logoHeight={48}
            gap={40}
            pauseOnHover
            scaleOnHover
            fadeOut
            fadeOutColor="#ffffff"
            ariaLabel="Technology partners"
          />
        </div>
    </PageTransition>
  );
}
