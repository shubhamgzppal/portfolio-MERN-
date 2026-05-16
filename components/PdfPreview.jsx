import { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc =
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

export default function PdfPreview({ fileUrl, className = "" }) {
  const [numPages, setNumPages] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [scale, setScale] = useState(1);

  const containerRef = useRef(null);

  const onLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const onLoadError = (err) => {
    console.error("PDF load error:", err);
    setLoadError(err?.message || "Failed to load PDF");
  };

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);

    return () => window.removeEventListener("resize", updateWidth);
  }, [fileUrl]);

  const pageWidth = containerWidth
    ? Math.min(Math.max(containerWidth - 32, 250), 900)
    : undefined;

  return (
    <div className={`w-full flex flex-col items-center ${className}`}>
      
      {/* PDF Viewer */}
      <div
        ref={containerRef}
        className="w-full overflow-auto flex justify-center"
        style={{ maxWidth: "900px", maxHeight: "80vh" }}
      >
        <Document
          file={fileUrl}
          onLoadSuccess={onLoadSuccess}
          onLoadError={onLoadError}
          loading={
            <div className="animate-spin h-10 w-10 border-2 border-secondary border-t-transparent rounded-full"></div>
          }
          error={
            <p className="text-red-500">
              {loadError ? `Failed to load PDF: ${loadError}` : "Failed to load PDF"}
            </p>
          }
        >
          {Array.from(new Array(numPages), (_, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              width={pageWidth}
              scale={scale}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="mb-4 shadow-lg rounded"
            />
          ))}
        </Document>
      </div>

      {/* Zoom Controls */}
      <div className="flex gap-4 mt-4 items-center">
        <button
          onClick={() => setScale((s) => Math.max(0.5, +(s - 0.1).toFixed(2)))}
          className="px-3 py-1 rounded bg-gray-700 text-white"
        >
          -
        </button>

        <span className="text-sm text-gray-300">
          {Math.round(scale * 100)}%
        </span>

        <button
          onClick={() => setScale((s) => +(s + 0.1).toFixed(2))}
          className="px-3 py-1 rounded bg-gray-700 text-white"
        >
          +
        </button>
      </div>

      {/* Page Count */}
      {numPages && (
        <div className="text-sm text-gray-400 mt-2">
          {numPages} pages
        </div>
      )}
    </div>
  );
}
