import fetch from "node-fetch";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.js";

/**
 * Extract text from a remote PDF using pdfjs-dist.
 * Netlify-compatible (no fs, no native modules).
 * @param {string} pdfUrl
 * @returns {Promise<string>}
 */
export async function extractTextFromPDF(pdfUrl) {
  const res = await fetch(pdfUrl);
  if (!res.ok) throw new Error(`Failed to fetch PDF: ${res.statusText}`);

  const arrayBuffer = await res.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    fullText += content.items.map((item) => item.str).join(" ") + "\n";
  }

  return fullText.trim();
}
