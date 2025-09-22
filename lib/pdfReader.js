import fs from "fs";
import fetch from "node-fetch";
import { getDocument } from "pdfjs-dist";

/**
 * Simple in-memory cache to avoid re-processing PDFs frequently
 */
const pdfCache = new Map();
const PDF_CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Extract plain text from a PDF file (local or URL) with caching.
 * @param {string} filePathOrUrl - Local file path or URL.
 * @returns {Promise<string>}
 */
export async function extractTextFromPDF(filePathOrUrl) {
  const now = Date.now();

  // Return cached text if valid
  const cached = pdfCache.get(filePathOrUrl);
  if (cached && now - cached.timestamp < PDF_CACHE_TTL_MS) {
    return cached.text;
  }

  let dataBuffer;

  try {
    // Load PDF as ArrayBuffer
    if (filePathOrUrl.startsWith("http")) {
      const response = await fetch(filePathOrUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
      }
      dataBuffer = await response.arrayBuffer();
    } else {
      if (!fs.existsSync(filePathOrUrl)) {
        throw new Error(`PDF not found at ${filePathOrUrl}`);
      }
      dataBuffer = fs.readFileSync(filePathOrUrl).buffer; // convert Buffer to ArrayBuffer
    }

    // Load PDF document
    const loadingTask = getDocument({ data: dataBuffer });
    const pdf = await loadingTask.promise;

    let fullText = "";

    // Extract text from each page
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      // Join text items with spaces and add newline after each page
      fullText += content.items.map((item) => item.str).join(" ") + "\n";
    }

    const text = fullText.trim();

    // Cache the extracted text
    pdfCache.set(filePathOrUrl, { text, timestamp: now });

    return text;
  } catch (err) {
    console.error("PDF extraction error:", err);
    throw err;
  }
}
