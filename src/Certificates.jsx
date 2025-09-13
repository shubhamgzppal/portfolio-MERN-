'use client';
import PageTransition from './components/PageTransition';
import { useState, useRef, useEffect, lazy, Suspense } from 'react';

import WebdegineCert from './assets/MSME WEB degsine certificate.pdf?url';
import CoreJavaCert from './assets/Core Java Training Certificate of Completion.pdf?url';
import OLevelCert from './assets/Shubham pal o level certificate.pdf?url';
import PythonForDataScience from './assets/Shubham Pal Python 101 for Data Science (IBM) certificate.pdf?url';
import FoundationsOfAI from './assets/Shubham pal Foundations of AI (Microsoft) certificate.pdf?url';

const PdfPreview = lazy(() => import('./components/PdfPreview'));

const certificatesData = {
  FULL_STACK: [
    {
      title: "Web Designing Certificate",
      provider: "Ministry of Micro, Small & Medium Enterprises (MSME)",
      icon: "MSME",
      url: WebdegineCert,
      date: "10 Oct 2024",
      skills: ["HTML", "CSS", "JavaScript", "WordPress", "Bootstrap", "Responsive Design", "Web Development Fundamentals", "UI/UX Principles", "Web Accessibility", "Web Hosting and Deployment", "Web Design Tools"]
    },
    {
      title: "Core Java",
      provider: "Internshala",
      icon: "💻",
      url: CoreJavaCert,
      date: "2 Nov 2024",
      skills: ["Java Introduction and Installation", "Java Programming Fundamentals", "Object Oriented Programming", "Advanced Java Topics", "Database Handling using Java", "GUI Programming", "Java and AI Modules"]
    },
    {
      title: "O Level Certificate",
      provider: "Government of India, Ministry of Human Resource Development (MHRD)",
      icon: "NIELIT",
      url: OLevelCert,
      date: "07 Mar 2022",
      skills: ["IT Tools and Business Systems", "Web Design and Development", "Programming and Problem Solving through Python", "Introduction to ICT Resources"]
    }
  ],
  DATA_SCIENCE: [
    {
      title: "Foundations of AI",
      provider: "Microsoft, Edunet Foundation, AICTE",
      icon: "Microsoft",
      url: FoundationsOfAI,
      date: "10 May 2025",
      skills: ["Artificial Intelligence", "Machine Learning Basics", "AI Ethics", "Data Analysis", "Python Programming", "Problem Solving with AI", "Foundational AI Concepts", "AI Applications", "AI Tools and Platforms"]
    },
    {
      title: "Python 101 for Data Science",
      provider: "IBM",
      icon: "📊",
      url: PythonForDataScience,
      date: "16 August 2025",
      skills: ["Python", "Data Analysis", "Data Visualization", "Pandas", "NumPy", "Matplotlib", "Seaborn", "Scikit-learn"]
    }
  ]
};

export default function Certificates() {
  const certificates = [...certificatesData.FULL_STACK, ...certificatesData.DATA_SCIENCE];
  const [modal, setModal] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (modal) {
      document.body.style.overflow = 'hidden';
      if (modalRef.current) modalRef.current.focus();

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

  const handleMouseMove = (e, card) => {
    cancelAnimationFrame(card._frame);
    card._frame = requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * 8;
      const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * -8;
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });
  };

  return (
    <PageTransition>
      {modal && (
        <div className="fixed inset-0 z-10 mt-20 flex items-center justify-center bg-black/60" onClick={() => setModal(null)}>
          <div ref={modalRef} onClick={e => e.stopPropagation()} className='overflow-auto'>
            <button className='absolute top-4 right-4 z-1 md:hidden text-white' onClick={() => setModal(null)}>Close</button>
            <Suspense fallback={<div className="text-center">Loading PDF...</div>}>
              <PdfPreview file={modal} className="rounded border" />
            </Suspense>
          </div>
        </div>
      )}

      <section className="bg-transparent dark:bg-transparent text-white py-20" id="certificates">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 wavy-underline drop-shadow-lg">Certificates</h2>
            <p className="text-gray-300 dark:text-gray-300 font-semibold drop-shadow">
              Professional certifications across Full Stack and Data Science
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6" style={{ perspective: '1000px', perspectiveOrigin: '50% 50%' }}>
            {certificates.map((cert, index) => (
              <div
                key={index}
                className="glass bg-white/10 dark:bg-primary/20 rounded-lg p-6 shadow-xl border border-secondary/10 backdrop-blur-sm hover:shadow-2xl font-semibold drop-shadow transition-all duration-300"
                style={{ transformStyle: 'preserve-3d', boxShadow: '0 12px 32px rgba(0,0,0,0.18), 0 1.5px 8px rgba(0,0,0,0.10)' }}
                onMouseMove={e => handleMouseMove(e, e.currentTarget)}
                onMouseLeave={e => (e.currentTarget.style.transform = '')}
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl pulse">{cert.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-lg text-secondary drop-shadow">{cert.title}</h3>
                      <span className="text-sm text-gray-300 dark:text-gray-400 font-semibold drop-shadow">{cert.date}</span>
                    </div>
                    <p className="text-gray-300 dark:text-gray-300 text-sm mb-3 font-semibold drop-shadow">{cert.provider}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {cert.skills.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="px-2 py-1 text-xs rounded-full bg-secondary/10 text-secondary font-semibold drop-shadow transition-transform hover:scale-105"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => setModal(cert.url)}
                      className="text-sm text-secondary hover:text-tertiary transition-colors flex items-center gap-1 font-semibold drop-shadow focus:outline-none"
                    >
                      View Certificate
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
