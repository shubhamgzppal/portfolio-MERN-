import PageTransition from '../components/PageTransition.jsx';
import dynamic from 'next/dynamic';
const PdfPreview = dynamic(() => import('../components/PdfPreview'), { ssr: false, loading: () => <div className="text-center">Loading PDF...</div> });
const RESUME_FILE = '/assets/SHUBHAM PAL Resume canav.pdf';

export default function Resume() {

  return (
    <PageTransition>
      <section id="resume" className="min-h-screen flex items-center justify-center py-20 px-4 relative z-2">
        <div className="w-full max-w-xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">Resume</h2>
            <p className="text-white font-semibold drop-shadow">My Updated Resume showcasing my skills and experience.</p>
          </div>

          <div className="bg-white/10 dark:bg-black/20 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg border border-secondary/10 relative z-2">
            
            <PdfPreview file={RESUME_FILE} className='h-[80vh]' />
                        
            <div className="pb-2 text-center text-sm text-gray-300">
              If the preview does not display, <a href={RESUME_FILE} download className="text-secondary underline">click here to download the PDF</a>.
            </div>
            <div className="mb-6 text-center">
              <a
                href={RESUME_FILE}
                download="SHUBHAM_PAL_Resume.pdf"
                className="inline-block bg-secondary text-primary px-6 py-2 rounded-lg font-semibold shadow-card hover:bg-tertiary transition"
              >
                Download Resume
              </a>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
