import PageTransition from './components/PageTransition';
import { useDomain } from './contexts/DomainContext';
import { useState, useRef, useEffect } from 'react';

const certificatesData = {
  FULL_STACK: [
    {
      title: "Web Designing Certificate",
      provider: "Ministry of Micro, Small & Medium Enterprises (MSME)",
      icon: "MSME",
      url: "/src/assets/MSME WEB degsine certificate.pdf",
      date: "10 Oct 2024",
      skills: ["HTML", "CSS", "JavaScript", "wordpress", "Bootstrap"]
    },
    {
      title: "Core Java",
      provider: "Internshala",
      icon: "💻",
      url: "/src/assets/Core Java Training - Certificate of Completion (2).pdf",
      date: "2 Nov 2024",
      skills: ["Java Introduction and Installation", "Java Programming Fundamentals", "Object Oriented Programming", "Advanced Java Topics", "Database Handling using Java", "GUI Programming", "Java and AI Modules"]
    },
    {
      title: "O Level Certificate",
      provider: "Government of India, Ministry of Human Resource Development (MHRD)",
      icon: "NIELIT",
      url: "/src/assets/Shubham pal o level certificate.pdf",
      date: "07 Mar 2022",
      skills: ["IT Tools and Business Systems", "Web Design and Development", "Programming and Problem Solving through Python", "Introduction to ICT Resources"]
    }
  ],
  DATA_SCIENCE: [
    {
      title: "Data Science Professional Certificate",
      provider: "IBM",
      icon: "📊",
      url: "/certificates/data-science-professional-certificate.pdf",
      date: "Jun 2024",
      skills: ["Python", "Data Analysis", "Machine Learning"]
    },
    {
      title: "Machine Learning Specialization",
      provider: "Coursera",
      icon: "🤖",
      url: "/certificates/machine-learning-specialization-certificate.pdf",
      date: "May 2024",
      skills: ["Scikit-learn", "TensorFlow", "Neural Networks"]
    },
    {
      title: "SQL and Database Design",
      provider: "DataCamp",
      icon: "🗃️",
      url: "/certificates/sql-database-design-certificate.pdf",
      date: "Apr 2024",
      skills: ["SQL", "Database Design", "Data Modeling"]
    },
    {
      title: "Data Visualization with Python",
      provider: "Kaggle",
      icon: "📈",
      url: "/certificates/data-visualization-python-certificate.pdf",
      date: "Mar 2024",
      skills: ["Matplotlib", "Seaborn", "Data Visualization"]
    }
  ]
};

export default function Certificates() {
  const { domainData } = useDomain();
  const certificates = certificatesData[domainData.title === "Data Scientist" ? 'DATA_SCIENCE' : 'FULL_STACK'];
  const [modal, setModal] = useState(null);
  const modalRef = useRef(null);

  // Prevent background scroll and trap focus in modal
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setModal(null)}
          aria-modal="true"
          role="dialog"
        >
          <div
            ref={modalRef}
            tabIndex={-1}
            className="bg-white dark:bg-black-100 rounded-lg shadow-lg p-4 max-w-2xl w-full relative flex flex-col items-center z-50 modal-content"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-xl text-gray-300 hover:text-secondary"
              onClick={() => setModal(null)}
              aria-label="Close modal"
            >
              &times;
            </button>
            <object
              data={modal}
              type="application/pdf"
              className="w-full h-[70vh] rounded border"
              aria-label="Certificate PDF"
              loading="lazy"
            >
              <p className="text-center">Unable to display PDF. <a href={modal} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Click here to download.</a></p>
            </object>
          </div>
        </div>
      )}
      <section className="bg-transparent dark:bg-transparent text-white-100 dark:text-white-100 py-20 md:py-32" id="certificates">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 wavy-underline drop-shadow-lg">Certificates</h2>
            <p className="text-gray-300 dark:text-gray-300 font-semibold drop-shadow">
              Professional certifications in {domainData.title} development
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6"
            style={{
              perspective: '1000px',
              perspectiveOrigin: '50% 50%'
            }}
          >
            {certificates.map((cert, index) => (
              <div 
                key={index}
                className="glass bg-white/10 dark:bg-primary/20 rounded-lg p-6 shadow-xl border border-secondary/10 backdrop-blur-sm hover:transform-gpu hover:scale-105 transition-all duration-300 hover:shadow-2xl font-semibold drop-shadow"
                style={{
                  transformStyle: 'preserve-3d',
                  boxShadow: '0 12px 32px rgba(0,0,0,0.18), 0 1.5px 8px rgba(0,0,0,0.10)'
                }}
                onMouseMove={e => {
                  const card = e.currentTarget;
                  const rect = card.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  const centerX = rect.width / 2;
                  const centerY = rect.height / 2;
                  const rotateX = ((y - centerY) / centerY) * 8;
                  const rotateY = ((x - centerX) / centerX) * -8;
                  card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = '';
                }}
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
                          className="px-2 py-1 text-xs rounded-full bg-secondary/10 text-secondary font-semibold drop-shadow"
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
