import { GoogleGenerativeAI } from '@google/generative-ai';
import { connectDB } from '../../lib/db.js';
import Chat from '../../modele/Chat.js';
import { extractTextFromPDF } from '../../lib/pdfReader.js';
import path from 'path';
import nc from 'next-connect';
import { extractTextFromWebsite } from '../../lib/websiteReader.js';

const apiHandler = nc();

apiHandler.use(async (req, res, next) => {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  try {
    req.body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body;
  } catch (error) {
    console.error('Error parsing request body:', error);
    req.body = {};
  }

  next();
});

apiHandler.post(async (req, res) => {
  const { history } = req.body;

  if (!history || history.length === 0) {
    return res.status(400).json({ error: 'Chat history is required.' });
  }

  await connectDB();

  if (!process.env.GOOGLE_API_KEY) {
    console.error('Missing GOOGLE_API_KEY environment variable');
    return res.status(500).json({ error: 'Server not configured: missing GOOGLE_API_KEY' });
  }

  let localPdfText = '';
  try {
    const pdfPath = path.join(process.cwd(), 'public', 'assets', 'SHUBHAM PAL Resume canav.pdf');
    console.log('Attempting to read PDF from public/assets:', pdfPath);
    localPdfText = await extractTextFromPDF(pdfPath);
  } catch (err) {
    console.warn('Failed to extract text from resume (public/assets):', err.message);
  }

  let websiteText = '';
  try {
    const websiteUrl = 'https://shubhamgzppal.netlify.app/';
    websiteText = await extractTextFromWebsite(websiteUrl);
  } catch (err) {
    console.warn('Failed to extract website text:', err.message);
  }

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

  const MAX_REPLY_TOKENS = process.env.MAX_REPLY_TOKENS ? Number(process.env.MAX_REPLY_TOKENS) : 150;

  const MAX_PDF_CHARS = 4000; 
  const MAX_MESSAGE_CHARS = 1000; 
  const MAX_HISTORY_MESSAGES = 12; 

   const safeResume = typeof localPdfText === 'string' && localPdfText.length > MAX_PDF_CHARS
    ? localPdfText.slice(0, MAX_PDF_CHARS) + '\n\n...[truncated]'
    : localPdfText || '';

  const safeWebsite = typeof websiteText === 'string' && websiteText.length > 4000
    ? websiteText.slice(0, 4000) + '\n\n...[truncated]'
    : websiteText || '';

  function truncateHistory(hist) {
    if (!Array.isArray(hist)) return [];
    const tail = hist.slice(-MAX_HISTORY_MESSAGES);
    return tail.map((msg) => {
      if (!msg || !Array.isArray(msg.parts)) return msg;
      return {
        ...msg,
        parts: msg.parts.map((p) => ({
          ...p,
          text: typeof p.text === 'string' && p.text.length > MAX_MESSAGE_CHARS
            ? p.text.slice(0, MAX_MESSAGE_CHARS) + '...[truncated]'
            : p.text,
        })),
      };
    });
  }

  const safeHistory = truncateHistory(history);
  const combinedContext = `You are an AI assistant representing Shubham Pal.
                        Respond in first person as his digital assistant — helpful, professional, and concise.
                        Answer only based on the provided resume and website data.
                        --- Resume Content ---
                        ${safeResume}
                        --- Website Content ---
                        ${safeWebsite}
                        --- History ---
                        ${safeHistory}
                      `;

  const contents = [
    { role: 'user', parts: [{ text: combinedContext, },],},
    { role: 'model', parts: [{ text: "Understood. I will act as Shubham Pal's assistant and only answer questions based on the provided resume and website content.",},],},
    ...safeHistory,
  ];

  try {
    const maxAttempts = 4;
    let attempt = 0;
    let lastErr = null;
    let reply = null;

    while (attempt < maxAttempts) {
      attempt += 1;
      try {
        const result = await model.generateContent({ contents });
        reply = typeof result.response?.text === 'function' ? await result.response.text() : String(result?.response ?? '');
        break;
      } catch (err) {
        lastErr = err;
        console.warn(`generateContent attempt ${attempt} failed:`, err?.message || err);
        const status = err?.status || err?.code || (err?.message && /503/.test(err.message) ? 503 : null);
        if (status === 503 && attempt < maxAttempts) {
          const backoff = Math.min(1000 * 2 ** (attempt - 1), 8000);
          const jitter = Math.floor(Math.random() * 300);
          await new Promise((r) => setTimeout(r, backoff + jitter));
          continue;
        }
        break;
      }
    }

    if (reply === null) {
      console.error('All generateContent attempts failed:', lastErr);
      const lastMsg = lastErr?.message || String(lastErr);
      if (/503|overload|temporar/i.test(lastMsg)) {
        return res.status(503).json({ error: 'Model overloaded', details: lastMsg });
      }
      return res.status(500).json({ error: 'Error processing chat', details: lastMsg });
    }

    const words = reply.split(/\s+/);
    if (words.length > MAX_REPLY_TOKENS) {
      reply = words.slice(0, MAX_REPLY_TOKENS).join(' ') + '...';
    }

    const lastUserMessage = history[history.length - 1]?.parts?.[0]?.text || '';
    try { await Chat.create({ userMessage: lastUserMessage, botReply: reply }); } catch (dbErr) { console.warn('Failed to save chat to DB:', dbErr?.message||dbErr); }

    return res.status(200).json({ reply });
  } catch (error) {
    console.error('Gemini API Error (outer):', error);
    return res.status(500).json({ error: 'Error processing chat', details: error?.message || String(error) });
  }
});

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  return apiHandler(req, res);
}
