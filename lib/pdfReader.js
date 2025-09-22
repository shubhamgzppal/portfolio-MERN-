import fs from "fs";
import fetch from "node-fetch";
import pdfParse from "pdf-parse";

const pdfCache = new Map();
const PDF_CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Extract plain text from a PDF file (local or URL) with caching.
 * @param {string} filePathOrUrl - Local file path or URL.
 * @returns {Promise<string>}
 */
export async function extractTextFromPDF(filePathOrUrl) {
  const now = Date.now();

  const cached = pdfCache.get(filePathOrUrl);
  if (cached && now - cached.timestamp < PDF_CACHE_TTL_MS) {
    return cached.text;
  }

  let dataBuffer;

  try {
    if (filePathOrUrl.startsWith("http")) {
      const response = await fetch(filePathOrUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
      }
      dataBuffer = Buffer.from(await response.arrayBuffer());
    } else {
      if (!fs.existsSync(filePathOrUrl)) {
        throw new Error(`PDF not found at ${filePathOrUrl}`);
      }
      dataBuffer = fs.readFileSync(filePathOrUrl);
    }

    const pdfData = await pdfParse(dataBuffer);
    const text = pdfData.text || "";

    pdfCache.set(filePathOrUrl, { text, timestamp: now });

    return text;
  } catch (err) {
    console.error("PDF extraction error:", err);
    throw err;
  }
}
