import React, { useState, useEffect } from 'react'
import PageTransition from '../components/PageTransition.jsx';
import dynamic from 'next/dynamic';
const PdfPreview = dynamic(() => import('../components/PdfPreview.jsx'), { ssr: false, loading: () => <div className="text-center">Loading PDF...</div> });

export default function Resume() {
  const [resumes, setResumes] = useState([]);

  useEffect(() => { fetchResumes(); }, []);
  
    const fetchResumes = async () => {
      try { const res = await fetch('/api/resume'); const data = await res.json(); if (res.ok) setResumes(data.data); else toast.error(data.error || 'Failed to fetch resumes');} 
      catch { toast.error('Error fetching resumes');}
    };

  return (
    <PageTransition>
      <section id="resume" className="min-h-screen flex items-center justify-center py-20 px-4 relative z-2">
        <div className="w-full max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">Resume</h2>
            <p className="text-white font-semibold drop-shadow">My Updated Resume showcasing my skills and experience.</p>
          </div>

          <div className="bg-white/10 dark:bg-black/20 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg border border-secondary/10 relative z-2">
            
            {resumes.length > 0 ? (
              <>
                <PdfPreview fileUrl={resumes[0].resumeUrl} />
                <div className="pb-2 text-center text-sm text-gray-300">
                  If the preview does not display,<a href={resumes[0].resumeUrl} download className="text-secondary underline">click here to download the PDF</a>.
                </div>
                <div className="mb-6 text-center">
                  <a href={resumes[0].resumeUrl} download="SHUBHAM_PAL_Resume.pdf"
                    className="inline-block bg-secondary text-primary px-6 py-2 rounded-lg font-semibold shadow-card hover:bg-tertiary transition"
                  >
                    Download Resume
                  </a>
                </div>
              </>
            ) : (
              <p className="text-center text-white py-6">No resume uploaded yet.</p>
            )}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
