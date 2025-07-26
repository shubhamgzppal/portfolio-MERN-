import PageTransition from './components/PageTransition.jsx';
import { useDomain } from './contexts/DomainContext';
import { motion } from 'framer-motion';
import { MotionContainer } from './components/MotionElements';
import { useInView } from 'react-intersection-observer';
import shubhamImg from "./assets/Shubham portfolio image.png"

export default function About() {
  const { domainData } = useDomain();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const domainContent = {
    FULL_STACK: {
      description: "I am a passionate developer with experience in building modern web applications using React, Node.js, and Tailwind CSS. I love creating beautiful, responsive, and user-friendly interfaces.",
      detailedDescription: [
        "I specialize in building modern web applications using the MERN stack and have a strong foundation in both frontend and backend technologies. My expertise includes React.js, Node.js, and modern CSS frameworks like Tailwind CSS.",
        "Currently pursuing a Diploma in Information Technology, I combine academic knowledge with practical development experience to create efficient and scalable solutions.",
        "With a keen eye for detail and a passion for clean code, I focus on creating responsive and user-friendly interfaces that deliver exceptional user experiences. I stay updated with the latest web technologies and best practices to ensure cutting-edge solutions.",
        "My experience extends to working with version control systems like Git, and I have hands-on experience with cloud platforms including AWS and Google Cloud. I'm always excited to take on new challenges and contribute to innovative projects."
      ],
      quote: "I believe in writing clean, maintainable code and creating intuitive user experiences that make a difference.",
      skills: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JavaScript', 'Tailwind CSS', 'Git']
    },
    DATA_SCIENCE: {
      description: "I am a data enthusiast with a strong foundation in machine learning, statistical analysis, and data visualization. I transform complex data into actionable insights.",
      detailedDescription: [
        "I specialize in data analysis and machine learning, using Python and its powerful ecosystems to extract meaningful insights from complex datasets.",
        "Currently pursuing a Diploma in Information Technology with a focus on data science and analytics, I combine theoretical knowledge with practical implementation.",
        "With expertise in data visualization and statistical analysis, I focus on creating clear, actionable insights that drive business decisions. I stay current with the latest machine learning techniques and best practices.",
        "My experience includes working with various data processing tools and frameworks, and I have hands-on experience with cloud-based machine learning platforms. I'm passionate about solving complex problems through data-driven approaches."
      ],
      quote: "I believe in the power of data to drive innovation and transform decision-making processes.",
      skills: ['Python', 'Machine Learning', 'Data Analysis', 'SQL', 'Pandas', 'NumPy', 'Scikit-learn']
    }
  };

  const content = domainContent[domainData.title === "Data Scientist" ? 'DATA_SCIENCE' : 'FULL_STACK'];

  return (
    <PageTransition>      
      <section className="bg-transparent dark:bg-transparent text-white dark:text-white-100 pt-20 pb-16 px-4 relative" id="about">        
        <MotionContainer>
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col-reverse lg:flex-row items-center gap-8 lg:items-start">
              <motion.div 
                className="w-full lg:w-3/5 text-center lg:text-left"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <motion.h2 
                  className="text-3xl md:text-4xl font-bold mb-6 wavy-underline drop-shadow-lg"
                  initial={{ y: -20, opacity: 0, rotateY: -8 }}
                  animate={{ y: 0, opacity: 1, rotateY: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  About Me
                </motion.h2>
                
                <motion.div
                  initial={{ y: 20, opacity: 0, rotateX: 8 }}
                  animate={{ y: 0, opacity: 1, rotateX: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-lg md:text-xl mb-6 backdrop-blur-sm bg-white/5 dark:bg-black/5 p-4 rounded-lg transform-gpu hover:scale-[1.02] transition-transform duration-300 font-semibold drop-shadow"
                >
                  Hi, I'm <span className="text-secondary font-semibold">Shubham Pal</span>, 
                  a {domainData.title} based in Ghazipur, {content.description}
                </motion.div>

                <div 
                  ref={ref}
                  className="text-base text-white dark:text-gray-300 space-y-4 backdrop-blur-sm bg-white/5 dark:bg-black/5 p-4 rounded-lg font-semibold drop-shadow"
                >
                  {content.detailedDescription.map((paragraph, index) => (
                    <motion.p 
                      key={index}
                      initial={{ y: 20, opacity: 0, rotateY: 6 }}
                      animate={inView ? { y: 0, opacity: 1, rotateY: 0 } : {}}
                      transition={{ duration: 0.5, delay: index * 0.2 }}
                      className="font-semibold drop-shadow"
                    >
                      {paragraph}
                    </motion.p>
                  ))}
                  <motion.p 
                    className="text-secondary/90 font-medium italic drop-shadow"
                    initial={{ y: 20, opacity: 0, rotateY: 6 }}
                    animate={inView ? { y: 0, opacity: 1, rotateY: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    "{content.quote}"
                  </motion.p>
                </div>

                <motion.div 
                  className="mt-8 backdrop-blur-sm bg-white/5 dark:bg-black/5 p-4 rounded-lg font-semibold drop-shadow"
                  initial={{ y: 20, opacity: 0 }}
                  animate={inView ? { y: 0, opacity: 1 } : {}}
                  transition={{ duration: 0.5, delay: 1 }}
                >
                  <h3 className="text-xl font-semibold mb-4 text-secondary">Core Technologies</h3>
                  <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                    {content.skills.map((skill, index) => (
                      <motion.span 
                        key={skill} 
                        className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm hover:bg-secondary/20 transition-colors font-semibold drop-shadow"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>

                <motion.div 
                  className="mt-8 flex gap-4 justify-center lg:justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                >
                  <motion.a 
                    href="https://www.linkedin.com/in/shubham-pal-700215253/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white hover:text-tertiary transition-colors transform-gpu"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zM1.5 19.5h3V9h-3z" />
                    </svg>
                  </motion.a>
                  <motion.a 
                    href="https://github.com/shubhamgzppal" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white hover:text-tertiary transition-colors transform-gpu"
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                  </motion.a>
                  <motion.a 
                    href="#contact" 
                    className="text-white hover:text-tertiary transition-colors transform-gpu"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </motion.a>
                </motion.div>
              </motion.div>

              <motion.div 
                className="w-2/3 sm:w-1/2 lg:w-2/5 flex items-center justify-center mt-8 lg:mt-12"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div
                  className="relative rounded-2xl backdrop-blur-sm glass bg-white/10 dark:bg-primary/20 overflow-hidden shadow-xl transform-gpu hover:scale-105 transition-all duration-500 flex items-center justify-center"
                  style={{
                    perspective: '1200px',
                    perspectiveOrigin: '50% 50%',
                    width: 'auto',
                    height: 'auto',
                    display: 'inline-block',
                  }}
                >
                  <motion.img
                    src={shubhamImg}
                    alt={`Shubham Pal - ${domainData.title}`}
                    className="block rounded-2xl"
                    initial={{ scale: 1.2, rotateY: 12, rotateX: 6 }}
                    animate={{ scale: 1, rotateY: 0, rotateX: 0 }}
                    transition={{ duration: 0.6 }}
                    whileHover={{ scale: 1.1, rotateY: 8, rotateX: 4 }}
                    style={{
                      boxShadow: '0 16px 40px rgba(0,0,0,0.25), 0 1.5px 8px rgba(0,0,0,0.10)',
                      transform: 'translateZ(32px)',
                      width: '100%',
                      height: 'auto',
                      maxWidth: '400px',
                      maxHeight: '500px',
                      objectFit: 'contain',
                    }}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </MotionContainer>
      </section>
    </PageTransition>
  );
}
