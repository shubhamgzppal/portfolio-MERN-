import { useState, useEffect, useRef, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import PageTransition from '../components/PageTransition';
import { MotionContainer } from '../components/MotionElements';
import EducationCard from '../components/EducationCard';
import dynamic from 'next/dynamic';

const PdfPreview = dynamic(() => import('../components/PdfPreview'), { ssr: false,loading: () => <div className="text-center">Loading PDF...</div>});

export default function Education() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [modal, setModal] = useState(null);
  const [educationData, setEducationData] = useState([]);
  const modalRef = useRef(null);

  useEffect(() => {
    fetch('/api/education').then(res => res.json()).then(data => setEducationData(data.data || [])).catch(err => console.error('Failed to load education data:', err));
  }, []);

  useEffect(() => {
    if (modal) { document.body.style.overflow = 'hidden';
      if (modalRef.current) modalRef.current.focus();
      const handleKeyDown = (e) => e.key === 'Escape' && setModal(null);
      window.addEventListener('keydown', handleKeyDown);
      return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', handleKeyDown);};
    }
  }, [modal]);

  const groupedByCategory = { DIPLOMA: [], INTERMEDIATE: [], HIGHSCHOOL: [], };

  for (const edu of educationData) { if (groupedByCategory[edu.category]) { groupedByCategory[edu.category].push(edu);}}

  const getCertificatePDF = () => {const selected = educationData.find((e) => e.category.toLowerCase() === modal); return selected?.certificateUrl || '';};

  return (
    <PageTransition>
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4" onClick={() => setModal(null)}>
          <div ref={modalRef} onClick={(e) => e.stopPropagation()} className="bg-white rounded-md p-4 max-w-3xl w-full max-h-[90vh] overflow-auto shadow-xl">
            <div className="flex justify-end">
              <button onClick={() => setModal(null)} className="text-red-500 font-semibold mb-2">Close ✕</button>
            </div>
            <Suspense fallback={<div className="text-center">Loading PDF...</div>}><PdfPreview fileUrl={getCertificatePDF()} /></Suspense>
          </div>
        </div>
      )}

      <section className="bg-transparent text-white items-center section-py" id="education">
        <MotionContainer>
          <div className="max-w-6xl mx-auto text-center">
            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 wavy-underline drop-shadow-lg">Education</h2>
              <p className="mb-8 text-white font-semibold drop-shadow">My academic journey and qualifications.</p>
            </motion.div>

            <motion.div
              ref={ref}
              initial="hidden"
              animate={inView ? 'show' : 'hidden'}
              variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.3 } } }}
              className="mb-8 p-8 glass bg-white/10 dark:bg-primary/20 rounded-lg shadow-xl border border-secondary/10 backdrop-blur-sm mx-4 font-semibold drop-shadow"
            >
              <div className="space-y-8 text-left">
                {['DIPLOMA', 'INTERMEDIATE', 'HIGHSCHOOL'].map((category) => (
                  groupedByCategory[category].map((edu, index) => (
                    <EducationCard
                      key={edu._id}
                      title={edu.title}
                      institute={<span>{edu.institute}</span>}
                      duration={<span>{edu.duration}</span>}
                      handleClick={() => setModal(category.toLowerCase())}
                      sections={[
                        { title: 'Key Focus Areas', items: edu.focusAreas },
                        { title: 'Achievements & Activities', items: edu.achievements },
                      ]}
                    />
                  ))
                ))}
              </div>
            </motion.div>
          </div>
        </MotionContainer>
      </section>
    </PageTransition>
  );
}
