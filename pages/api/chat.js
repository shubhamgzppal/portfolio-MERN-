import path from "path";
import nc from "next-connect";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { connectDB } from "../../lib/db.js";
import Chat from "../../modele/Chat.js";
import { extractTextFromPDF } from "../../lib/pdfReader.js";
import { extractTextFromWebsite } from "../../lib/websiteReader.js";

// --- CORS Middleware ---
function corsMiddleware(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  next();
}

const apiHandler = nc({ onError, onNoMatch });

apiHandler.use(corsMiddleware);

// --- Error handling helpers ---
function onError(err, req, res) {
  console.error("API Error:", err);
  res.status(500).json({ error: "Internal Server Error", details: err.message });
}

function onNoMatch(req, res) {
  res.status(405).json({ error: `Method ${req.method} not allowed` });
}

// --- Main POST handler ---
apiHandler.post(async (req, res) => {
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { history } = body;

    if (!history || !Array.isArray(history) || history.length === 0) {
      return res.status(400).json({ error: "Chat history is required." });
    }

    await connectDB();

    if (!process.env.GOOGLE_API_KEY) {
      return res.status(500).json({ error: "Missing GOOGLE_API_KEY in environment." });
    }

    // --- Load Resume PDF ---
    let localPdfText = "";
    try {
      const pdfPath = path.join(process.cwd(), "public", "assets", "SHUBHAM PAL Resume canav.pdf");
      console.log("Reading PDF:", pdfPath);
      localPdfText = await extractTextFromPDF(pdfPath);
    } catch (err) {
      console.warn("Failed to extract resume PDF:", err.message);
    }

    // --- Load Website ---
    let websiteText = "";
    try {
      const websiteUrl = "https://shubhamgzppal.netlify.app/";
      websiteText = await extractTextFromWebsite(websiteUrl);
    } catch (err) {
      console.warn("Failed to extract website text:", err.message);
    }

    // --- AI Model Setup ---
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const MAX_REPLY_TOKENS = Number(process.env.MAX_REPLY_TOKENS) || 150;
    const MAX_PDF_CHARS = 4000;
    const MAX_MESSAGE_CHARS = 1000;
    const MAX_HISTORY_MESSAGES = 12;

    const safeResume =
      typeof localPdfText === "string" && localPdfText.length > MAX_PDF_CHARS
        ? localPdfText.slice(0, MAX_PDF_CHARS) + "\n\n...[truncated]"
        : localPdfText;

    const safeWebsite =
      typeof websiteText === "string" && websiteText.length > 4000
        ? websiteText.slice(0, 4000) + "\n\n...[truncated]"
        : websiteText;

    // --- History Truncation ---
    function truncateHistory(hist) {
      const tail = hist.slice(-MAX_HISTORY_MESSAGES);
      return tail.map((msg) => ({
        ...msg,
        parts: (msg.parts || []).map((p) => ({
          ...p,
          text:
            typeof p.text === "string" && p.text.length > MAX_MESSAGE_CHARS
              ? p.text.slice(0, MAX_MESSAGE_CHARS) + "...[truncated]"
              : p.text,
        })),
      }));
    }

    const safeHistory = truncateHistory(history);

    const combinedContext = `You are an AI assistant representing Shubham Pal.
    Respond in first person as his digital assistant — helpful, professional, and concise.
    Only answer based on the provided resume and website content.
    --- Resume ---
    ${safeResume}
    --- Website ---
    ${safeWebsite}
    --- History ---
    ${JSON.stringify(safeHistory, null, 2)}
    `;

    const contents = [
      { role: "user", parts: [{ text: combinedContext }] },
      {
        role: "model",
        parts: [
          {
            text: "Understood. I will act as Shubham Pal's assistant and only answer questions based on the provided resume and website content.",
          },
        ],
      },
      ...safeHistory,
    ];

    // --- Retry Loop for Gemini ---
    let reply = null;
    let lastErr = null;
    const maxAttempts = 4;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const result = await model.generateContent({ contents });
        reply = result.response.text();
        break;
      } catch (err) {
        lastErr = err;
        console.warn(`Gemini attempt ${attempt} failed:`, err.message);
        if (/503/.test(err.message) && attempt < maxAttempts) {
          const backoff = Math.min(1000 * 2 ** (attempt - 1), 8000);
          await new Promise((r) => setTimeout(r, backoff + Math.random() * 300));
          continue;
        }
        break;
      }
    }

    if (!reply) {
      return res
        .status(500)
        .json({ error: "Failed to generate AI reply", details: lastErr?.message || String(lastErr) });
    }

    // --- Trim reply length ---
    const words = reply.split(/\s+/);
    if (words.length > MAX_REPLY_TOKENS) {
      reply = words.slice(0, MAX_REPLY_TOKENS).join(" ") + "...";
    }

    // --- Save Chat ---
    try {
      const lastUserMessage = history[history.length - 1]?.parts?.[0]?.text || "";
      await Chat.create({ userMessage: lastUserMessage, botReply: reply });
    } catch (dbErr) {
      console.warn("Failed to save chat:", dbErr.message);
    }

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("API Fatal Error:", err);
    return res.status(500).json({ error: "Unexpected error", details: err.message });
  }
});

export default apiHandler;
