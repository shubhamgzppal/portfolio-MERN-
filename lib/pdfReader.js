import fs from 'fs';
import fetch from 'node-fetch';
import pdfParse from 'pdf-parse';

export async function extractTextFromPDF(filePathOrUrl) {
  let dataBuffer;

  if (filePathOrUrl.startsWith('http')) {
    const response = await fetch(filePathOrUrl);
    if (!response.ok) throw new Error(`Failed to fetch PDF: ${response.statusText}`);
    dataBuffer = await response.arrayBuffer();
    dataBuffer = Buffer.from(dataBuffer);
  } else {
    console.log('Reading PDF from path:', filePathOrUrl);
    dataBuffer = fs.readFileSync(filePathOrUrl);
  }

  const pdfData = await pdfParse(dataBuffer);
  return pdfData.text;
}
