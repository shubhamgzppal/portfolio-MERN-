import { useState, useEffect } from 'react';
import PageTransition from '../components/PageTransition.jsx';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { MotionContainer } from '../components/MotionElements.jsx';
import { toast } from 'react-hot-toast';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.2 },},};

  const item = { hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 },};

  useEffect(() => {
    const fetchProjects = async () => {
      try { const res = await fetch('/api/projects'); const data = await res.json();
        if (res.ok) { setProjects(data.data || []);
        } else { toast.error(data.error || 'Failed to fetch projects');}
      } catch (error) { toast.error('Error fetching projects');
      } finally { setLoading(false);}};
    fetchProjects();
  }, []);

  return (
    <PageTransition>
      <section className="bg-transparent dark:bg-transparent text-white-100 dark:text-white-100 items-center py-20 px-5" id="projects">
        <MotionContainer>
          <div className="max-w-6xl mx-auto">
            <motion.div className="text-center mb-12" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 wavy-underline drop-shadow-lg">Projects</h2>
              <p className="text-white font-semibold drop-shadow mb-2">Featured projects that showcase my Full Stack and Data Science work</p>
            </motion.div>

            {loading ? ( <p className="text-center text-gray-400">Loading projects...</p>
            ) : (
              <motion.div ref={ref} variants={container} initial="hidden" animate={inView ? 'show' : 'hidden'}className="grid md:grid-cols-2 gap-8" style={{ perspective: '1200px', perspectiveOrigin: '50% 50%' }}>
                {projects.map((project, idx) => (
                  <motion.div key={idx} variants={item}
                    className="glass bg-white/10 dark:bg-primary/20 rounded-xl shadow-xl border border-secondary/10 backdrop-blur-sm overflow-hidden hover:transform-gpu hover:scale-[1.04] transition-all duration-300 hover:shadow-2xl relative group"
                    style={{ transformStyle: 'preserve-3d', boxShadow:'0 16px 40px rgba(0,0,0,0.18), 0 1.5px 8px rgba(0,0,0,0.10)',}}
                    whileHover={{ scale: 1.06, transition: { type: 'spring', stiffness: 200 },}}
                  >
                    <div className="aspect-video bg-gray-100 dark:bg-gray-800 overflow-hidden" style={{ perspective: '800px' }}>
                      <motion.img src={project.image} alt={project.title}
                        className="w-full h-full object-cover transform-gpu group-hover:scale-110 transition-transform duration-500"
                        whileHover={{ scale: 1.12, rotateY: 6, rotateX: 2 }} transition={{ type: 'spring', stiffness: 300 }}
                        style={{ boxShadow:'0 8px 24px rgba(0,255,247,0.18), 0 1.5px 8px rgba(0,0,0,0.10)', transform: 'translateZ(24px)',}}
                      />
                    </div>
                    <div className="p-6 transform-gpu group-hover:translate-y-[-5px] transition-transform duration-300" style={{ transform: 'translateZ(16px)' }}>
                      <h3 className="text-xl font-semibold mb-2 text-secondary drop-shadow-lg">{project.title}</h3>
                      <p className="text-sm text-gray-300 dark:text-gray-300 mb-4 font-semibold drop-shadow">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tech?.map((tech, techIdx) => (
                          <motion.span key={techIdx} className="px-2 py-1 text-xs rounded-full bg-secondary/10 text-secondary font-semibold drop-shadow" whileHover={{ scale: 1.1, rotateY: 8 }} whileTap={{ scale: 0.95 }}>
                            {tech}
                          </motion.span>
                        ))}
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        <motion.a href={project.link} className="text-sm text-secondary hover:text-tertiary transition-colors flex items-center gap-1 font-semibold drop-shadow"
                          whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }} target="_blank" rel="noopener noreferrer"
                        >
                          Live Demo
                          <motion.svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </motion.svg>
                        </motion.a>

                        <motion.a href={project.github} className="text-sm text-secondary hover:text-tertiary transition-colors flex items-center gap-1 font-semibold drop-shadow"
                          whileHover={{ x: 5 }} whileTap={{ scale: 0.95 }} target="_blank" rel="noopener noreferrer"
                        >
                          GitHub
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                          </svg>
                        </motion.a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </MotionContainer>
      </section>
    </PageTransition>
  );
}
