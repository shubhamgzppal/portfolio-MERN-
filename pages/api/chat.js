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

function onError(err, req, res) {
  console.error("API Error:", err);
  res.status(500).json({ error: "Internal Server Error", details: err.message });
}

function onNoMatch(req, res) {
  res.status(405).json({ error: `Method ${req.method} not allowed` });
}

// --- Cache Setup ---
let cachedResumeText = null;
let cachedWebsiteText = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

async function fetchResumeAndWebsite(origin) {
  const now = Date.now();
  if (cachedResumeText && cachedWebsiteText && now - lastCacheTime < CACHE_TTL_MS) {
    console.log("Using cached resume and website text");
    return { resume: cachedResumeText, website: cachedWebsiteText };
  }

  console.log("Fetching resume and website text afresh");

  // Fetch resume URL from your API
  const resumeUrlEndpoint = `${origin}/api/resume`;
  console.log("Fetching resume URL from:", resumeUrlEndpoint);

  const resumeRes = await fetch(resumeUrlEndpoint);
  if (!resumeRes.ok) {
    throw new Error(`Resume API error: ${resumeRes.status} ${resumeRes.statusText}`);
  }

  const resumeData = await resumeRes.json();
  console.log("Resume API response data:", resumeData);

  const resumeUrl = resumeData?.data?.[0]?.resumeUrl;
  if (!resumeUrl) {
    throw new Error("No resume URL found in the resume API response");
  }

  console.log("Extracting text from resume PDF at URL:", resumeUrl);

  // Parallel fetch & extract text
  const [resumeText, websiteText] = await Promise.all([
    extractTextFromPDF(resumeUrl),
    extractTextFromWebsite("https://shubhamgzppal.netlify.app/"),
  ]);

  console.log(`Extracted resume text length: ${resumeText.length}`);
  console.log(`Extracted website text length: ${websiteText.length}`);

  cachedResumeText = resumeText;
  cachedWebsiteText = websiteText;
  lastCacheTime = now;

  return { resume: resumeText, website: websiteText };
}

// --- History truncation helper ---
const MAX_HISTORY_MESSAGES = 10;
const MAX_MESSAGE_CHARS = 1000;

function truncateHistory(history) {
  const tail = history.slice(-MAX_HISTORY_MESSAGES);
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

apiHandler.post(async (req, res) => {
  const startTime = Date.now();

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { history } = body;

    if (!history || !Array.isArray(history) || history.length === 0) {
      return res.status(400).json({ error: "Chat history is required." });
    }

    const origin = req.headers.origin || `https://${req.headers.host}`;
    console.log("Origin for fetching resume:", origin);

    // Fetch resume + website with caching & parallel
    let localPdfText = "";
    let websiteText = "";

    try {
      const fetched = await fetchResumeAndWebsite(origin);
      localPdfText = fetched.resume;
      websiteText = fetched.website;
      console.log(`Fetched resume + website successfully`);
    } catch (err) {
      console.warn("Failed to fetch resume or website:", err.message);
      // You might want to return an error here or continue without resume/website
      return res.status(500).json({ error: "Failed to fetch resume or website content", details: err.message });
    }

    // Truncate content for prompt size
    const MAX_PDF_CHARS = 4000;
    const MAX_WEBSITE_CHARS = 3000;

    const safeResume =
      typeof localPdfText === "string" && localPdfText.length > MAX_PDF_CHARS
        ? localPdfText.slice(0, MAX_PDF_CHARS) + "\n\n...[truncated]"
        : localPdfText;

    const safeWebsite =
      typeof websiteText === "string" && websiteText.length > MAX_WEBSITE_CHARS
        ? websiteText.slice(0, MAX_WEBSITE_CHARS) + "\n\n...[truncated]"
        : websiteText;

    // Truncate history messages
    const safeHistory = truncateHistory(history);

    // Format history for prompt
    const formattedHistory = safeHistory
      .map((msg) => {
        const speaker = msg.role === "user" ? "User" : "Assistant";
        const content = msg.parts?.[0]?.text || "";
        return `${speaker}: ${content}`;
      })
      .join("\n");

    // Compose AI prompt context
    const combinedContext = `You are an AI assistant representing Shubham Pal.
Respond in first person as his digital assistant — helpful, professional, and concise.
Only answer based on the provided resume and website content.
--- Website ---
${safeWebsite}
--- Resume ---
${safeResume}
--- History ---
${formattedHistory}
`;

    // Prepare Gemini content
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

    // --- AI Model Setup ---
    if (!process.env.GOOGLE_API_KEY) {
      console.error("Missing GOOGLE_API_KEY environment variable!");
      return res.status(500).json({ error: "Missing API key for Google Generative AI" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const MAX_REPLY_TOKENS = Number(process.env.MAX_REPLY_TOKENS) || 250;

    // Retry loop for model call
    let reply = null;
    let lastErr = null;
    const maxAttempts = 4;

    const modelCallStart = Date.now();

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const result = await model.generateContent({ contents });
        reply = result.response.text();
        console.log(`Gemini response generated in ${Date.now() - modelCallStart} ms`);
        console.log("Reply (truncated to 100 chars):", reply.slice(0, 100));
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
      console.error("Failed to generate AI reply:", lastErr);
      return res
        .status(500)
        .json({ error: "Failed to generate AI reply", details: lastErr?.message || String(lastErr) });
    }

    // Trim reply length to token limit
    const words = reply.split(/\s+/);
    if (words.length > MAX_REPLY_TOKENS) {
      reply = words.slice(0, MAX_REPLY_TOKENS).join(" ") + "...";
    }

    console.log(`Total API time: ${Date.now() - startTime} ms`);

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("API Fatal Error:", err);
    return res.status(500).json({ error: "Unexpected error", details: err.message });
  }
});

export default apiHandler;
