import PageTransition from './components/PageTransition.jsx';
import ResumeCart from "./assets/SHUBHAM PAL Resume canav.pdf";
import { useState } from 'react';

export default function Resume() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <PageTransition>
      <section id="resume" className="min-h-screen flex items-center justify-center py-20 px-4 relative z-2">
        <div className="w-full max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center text-white">Resume</h2>

          <div className="bg-white/10 dark:bg-black/20 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg border border-secondary/10 relative z-2">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
              </div>
            )}
            
            {/* Embedded PDF preview with toolbar */}
            <object
              data={`${ResumeCart}#toolbar=1&navpanes=1&scrollbar=1`}
              type="application/pdf"
              className="w-full h-[80vh]"
              aria-label="Resume PDF preview"
              onLoad={() => setIsLoading(false)}
            >
              <div className="flex items-center justify-center h-full bg-gray-100 p-4">
                <p className="text-gray-800">PDF cannot be displayed. Please download the resume using the button below.</p>
              </div>
            </object>

            {/* Fallback for older browsers */}
            <div className="p-4 text-center text-sm text-gray-300">
              If the preview does not display, <a href={ResumeCart} download className="text-secondary underline">click here to download the PDF</a>.
            </div>
            <div className="mb-6 text-center">
              <a
                href={ResumeCart}
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
