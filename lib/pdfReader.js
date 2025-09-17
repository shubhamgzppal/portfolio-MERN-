import fs from "fs";
import fetch from "node-fetch";
import pdfParse from "pdf-parse";

/**
 * Extract plain text from a PDF file or URL.
 * @param {string} filePathOrUrl - Local file path or URL
 * @returns {Promise<string>}
 */
export async function extractTextFromPDF(filePathOrUrl) {
  let dataBuffer;

  // --- If input is a URL ---
  if (filePathOrUrl.startsWith("http")) {
    const response = await fetch(filePathOrUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.status} ${response.statusText}`);
    }
    dataBuffer = Buffer.from(await response.arrayBuffer());
  } else {
    // --- If input is a local file ---
    if (!fs.existsSync(filePathOrUrl)) {
      throw new Error(`PDF not found at ${filePathOrUrl}`);
    }
    dataBuffer = fs.readFileSync(filePathOrUrl);
  }

  // --- Parse PDF ---
  const pdfData = await pdfParse(dataBuffer);
  return pdfData.text || "";
}
