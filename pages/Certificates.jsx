'use client';
import PageTransition from '../components/PageTransition';
import { useState, useRef, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';

// Load PDF preview dynamically (SSR disabled)
const PdfPreview = dynamic(() => import('../components/PdfPreview'), { ssr: false, loading: () => <div className="text-center text-white">Loading PDF...</div>,});

export default function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [modalUrl, setModalUrl] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      try { const res = await fetch('/api/certificates'); const json = await res.json();
        if (json.success) { setCertificates(json.data);}
        else {console.error("Error fetching certificates:", json.error);}
      } catch (err) { console.error("Fetch error:", err);}
    }; fetchCertificates();
  }, []);

  useEffect(() => {
    if (modalUrl) {
      document.body.style.overflow = 'hidden';
      modalRef.current?.focus();
      const handleEscape = (e) => { if (e.key === 'Escape') setModalUrl(null); };
      window.addEventListener('keydown', handleEscape);
      return () => { window.removeEventListener('keydown', handleEscape); document.body.style.overflow = ''; };
    }
  }, [modalUrl]);

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

  const handleMouseLeave = (card) => { card.style.transform = '';};

  return (
    <PageTransition>
      {modalUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4" onClick={() => setModalUrl(null)}>
          <div ref={modalRef} onClick={(e) => e.stopPropagation()} className="bg-white rounded-md p-4 max-w-3xl w-full max-h-[90vh] overflow-auto shadow-xl">
            <div className="flex justify-end">
              <button onClick={() => setModalUrl(null)} className="text-red-500 font-semibold mb-2">Close ✕</button>
            </div>
            <Suspense fallback={<div className="text-center">Loading PDF...</div>}><PdfPreview fileUrl={modalUrl} /></Suspense>
          </div>
        </div>
      )}

      <section className="py-20 text-white" id="certificates">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 wavy-underline drop-shadow-lg">Certificates </h2>
            <p className="text-gray-300 font-semibold drop-shadow">Professional certifications across Full Stack and Data Science </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6" style={{ perspective: '1000px', perspectiveOrigin: 'center' }}>
            {certificates.map((cert) => (
              <div onMouseMove={(e) => handleMouseMove(e, e.currentTarget)} onMouseLeave={(e) => handleMouseLeave(e.currentTarget)} key={cert._id}
                className="glass bg-white/10 dark:bg-primary/20 rounded-lg p-6 shadow-xl border border-secondary/10 backdrop-blur-sm hover:shadow-2xl font-semibold drop-shadow transition-all duration-300"
                style={{ transformStyle: 'preserve-3d', boxShadow:'0 12px 32px rgba(0,0,0,0.18), 0 1.5px 8px rgba(0,0,0,0.10)',}}
               >
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{cert.icon || '📄'}</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-lg text-secondary drop-shadow">{cert.title}</h3>
                      <span className="text-sm text-gray-400 font-semibold drop-shadow">{cert.date}</span>
                    </div>
                    <p className="text-gray-300 text-sm mb-3 font-semibold drop-shadow"> {cert.provider}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {cert.skills?.map((skill, idx) => (
                        <span key={idx} className="px-2 py-1 text-xs rounded-full bg-secondary/10 text-secondary font-semibold drop-shadow hover:scale-105 transition-transform">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <button onClick={() => setModalUrl(cert.url)} className="text-sm text-secondary hover:text-tertiary transition-colors flex items-center gap-1 font-semibold drop-shadow focus:outline-none">
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
