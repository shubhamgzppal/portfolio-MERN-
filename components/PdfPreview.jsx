import { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

export default function PdfPreview({ file, className = "" }) {
  const [loadError, setLoadError] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1.0);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
    if (containerRef.current) setContainerWidth(containerRef.current.clientWidth);
  };

  const onDocumentLoadError = (error) => {
    console.error('PdfPreview load error for', file, 'workerSrc=', pdfjs.GlobalWorkerOptions.workerSrc, error);
    setLoadError(error?.message || String(error));
  };

  useEffect(() => {
    function updateWidth() {
      if (containerRef.current) setContainerWidth(containerRef.current.clientWidth);
    }
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [file]);

  const pageWidth = containerWidth ? Math.min(Math.max(containerWidth - 32, 200), 900) : undefined;

  return (
    <div className={`items-center justify-center ${className}`}>
      <div
        ref={containerRef}
        className="overflow-auto flex justify-center items-start"
        style={{ width: '100%', maxWidth: '900px', maxHeight: '70vh' }}
      >
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={<div className="animate-spin rounded-full items-center justify-center h-12 w-12 border-t-2 border-b-2 border-secondary"></div>}
          error={<p className="text-red-500">{loadError ? `Failed to load PDF: ${loadError}` : 'Failed to load PDF.'}</p>}
          className="flex"
        >
          <Page
            pageNumber={pageNumber}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            className="shadow-lg rounded"
            width={pageWidth}
            scale={scale}
          />
        </Document>
  </div>

  <div className="flex justify-center items-center gap-4 mt-4">
        <button
          onClick={() => setScale(s => Math.max(0.2, +(s - 0.1).toFixed(2)))}
          className="px-3 py-1 rounded bg-gray-600 text-white"
          aria-label="Zoom out"
        >
          -
        </button>
        <span className="text-sm text-gray-300">{Math.round(scale * 100)}%</span>
        <button
          onClick={() => setScale(s => +(s + 0.1).toFixed(2))}
          className="px-3 py-1 rounded bg-gray-600 text-white"
          aria-label="Zoom in"
        >
          +
        </button>
      </div>

      {numPages && numPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-2">
          <button
            onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
            disabled={pageNumber === 1}
            className="px-3 py-1 rounded bg-secondary text-white disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-300">
            Page {pageNumber} of {numPages}
          </span>
          <button
            onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))}
            disabled={pageNumber === numPages}
            className="px-3 py-1 rounded bg-secondary text-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
