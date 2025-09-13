import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import PageTransition from './components/PageTransition';
import { MotionContainer } from './components/MotionElements';
import EducationCard from './components/EducationCard';
import PdfPreview from './components/PdfPreview';

import highSchoolCert from './assets/Shubham high school certificate.pdf';
import intermediateCert from './assets/Shubham intermediate certificate.pdf';
import diplomaCert from './assets/Diploma Final year result certificate.pdf';

export default function Education() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [modal, setModal] = useState(null);
  const modalRef = useRef(null);

 const focusAreas = {
  DiplomaFocus : [
    'Full Stack Web Development',
    'Database Management Systems',
    'Software Engineering Principles',
    'Computer Networks',
    'Operating Systems',
    'Data Structures & Algorithms'
  ],
  highSchoolFocus : [
    'Mathematics',
    'Science (Physics, Chemistry, Biology)',
    'English Language & Literature',
    'Social Science (History, Civics, Geography, Economics)',
    'Hindi',
    'Drawing & Creative Arts',
    'Moral Science & Physical Education'
  ],
  intermediateFocus : [
    'Physics',
    'Chemistry',
    'Mathematics',
    'English',
    'Hindi',
    'Sports & Physical Education',
    'Cultural & Academic Activities'
  ]
}

const achievements = {
  Diploma: [
    'Achieved First Division with strong academic performance (2311/3255)',
    'Excelled in core IT subjects including Python, PHP, Cloud Computing, and Android Development',
    'Scored 80/100 in Final Year Major Project, showcasing practical implementation of IT solutions',
    'Earned full marks in Student-Centred Activities (30/30),',
    'highlighting active participation in academic and professional growth programs',
    'Gained hands-on experience through Industrial Training, Minor Projects, and applied coursework'
  ],
  InterMediate: [
    'Secured First Division with consistent performance across core subjects (PCM + English + Hindi)',
    'Demonstrated strong foundation in Mathematics, Physics, and Chemistry',
    'Achieved highest marks in Sports & Physical Education (74/100), reflecting all-round development',
    'Actively participated in academic and cultural programs at school level',
    'Balanced academics with extracurricular activities, building leadership and teamwork skills'
  ],
  HighSchool: [
    'Achieved strong grades across core subjects, including English (85/100, Grade A2) and Social Science (82/100, Grade A2)',
    'Demonstrated creativity and excellence in Drawing (86/100, Grade A2)',
    'Consistently performed well in Mathematics and Science, building a strong foundation for higher studies',
    'Earned Grade A in Moral, Sports & Physical Education, reflecting discipline and holistic growth',
    'Balanced academics with extracurricular and cultural participation'
  ]
};

  const getCertificatePDF = () => {
    switch (modal) {
      case 'highschool': return highSchoolCert;
      case 'intermediate': return intermediateCert;
      case 'diploma': return diplomaCert;
      default: return null;
    }
  };

  useEffect(() => {
    if (modal) {
      document.body.style.overflow = 'hidden';
      if (modalRef.current) {
        modalRef.current.focus();
      }
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') setModal(null);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [modal]);

  return (
    <PageTransition>
      {modal && (
        <div className="fixed inset-0 flex z-10 mt-12 items-center justify-center bg-black/60" onClick={() => setModal(null)}>
          <div ref={modalRef} className="overflow-auto" onClick={e => e.stopPropagation()}>
            <button className="absolute top-4 right-4 z-1 md:hidden text-white" onClick={() => setModal(null)}>Close</button>
            <PdfPreview file={getCertificatePDF()} className="rounded border" />
          </div>
        </div>
      )}

      <section className="bg-transparent dark:bg-transparent text-white items-center section-py" id="education">
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
                <EducationCard
                  title="Diploma in Information Technology"
                  institute={<span>Government Polytechnic College Ghaziabad</span>}
                  duration={<span>2022 - 2025</span>}
                  handleClick={() => setModal('diploma')}
                  items={achievements.Diploma}
                  sections={[{title: "Key Focus Areas", items: focusAreas.DiplomaFocus},{title: "Achievements & Activities", items: achievements.Diploma}]}
                />
                <EducationCard
                  title="Intermediate"
                  institute={<span>Hindu Inter College Zamamnia R S Ghazipur</span>}
                  duration={<span>2017 - 2018</span>}
                  handleClick={() => setModal('intermediate')}
                  sections={[{title: "Key Focus Areas", items: focusAreas.intermediateFocus},{ title: "Achievements & Activities", items: achievements.InterMediate }]}
                />
                <EducationCard
                  title="High School"
                  institute={<span>S B V M H S S Zamamnia R S Ghazipur</span>}
                  duration={<span>2015 - 2016</span>}
                  handleClick={() => setModal('highschool')}
                  sections={[{title: "Key Focus Areas", items: focusAreas.highSchoolFocus},{ title: "Achievements & Activities", items: achievements.HighSchool }]}
                />
              </div>
            </motion.div>
          </div>
        </MotionContainer>
      </section>
    </PageTransition>
  );
}
