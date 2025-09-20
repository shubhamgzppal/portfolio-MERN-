import path from "path";
import nc from "next-connect";
import { GoogleGenerativeAI } from "@google/generative-ai";
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

    let localPdfText = "";
    try {
      // Dynamically get resume URL from your resume API (same as client does)
      const resumeRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/resume`);
      const resumeData = await resumeRes.json();

      const resumeUrl = resumeData?.data?.[0]?.resumeUrl;
      if (!resumeUrl) throw new Error("No resume URL found");

      console.log("Fetching resume from URL:", resumeUrl);
      localPdfText = await extractTextFromPDF(resumeUrl);
    } catch (err) {
      console.warn("Failed to extract resume PDF from server:", err.message);
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

    const MAX_REPLY_TOKENS = Number(process.env.MAX_REPLY_TOKENS) || 250;
    const MAX_PDF_CHARS = 4000;
    const MAX_MESSAGE_CHARS = 1000;
    const MAX_HISTORY_MESSAGES = 10;

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

    const formattedHistory = safeHistory.map((msg) => {
      const speaker = msg.role === "user" ? "User" : "Assistant";
      const content = msg.parts?.[0]?.text || "";
      return `${speaker}: ${content}`;
    }).join("\n");


    const combinedContext = `You are an AI assistant representing Shubham Pal.
    Respond in first person as his digital assistant — helpful, professional, and concise.
    Only answer based on the provided resume and website content.
    --- Resume ---
    ${safeResume}
    --- Website ---
    ${safeWebsite}
    --- History ---
    ${formattedHistory}
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
    return res.status(200).json({ reply });
  } catch (err) {
    console.error("API Fatal Error:", err);
    return res.status(500).json({ error: "Unexpected error", details: err.message });
  }
});

export default apiHandler;
