import fetch from "node-fetch";
import pdf from "pdf-parse";

export async function extractTextFromPDF(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch PDF: ${res.status} ${res.statusText}`);

    const buffer = Buffer.from(await res.arrayBuffer());
    const data = await pdf(buffer);

    return data.text.trim();
  } catch (err) {
    console.error("PDF parse error:", err.message);
    throw err;
  }
}
