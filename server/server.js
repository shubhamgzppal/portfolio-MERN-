import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import pdf from "pdf-extraction"; 
import { GoogleGenerativeAI } from "@google/generative-ai";
import { connectDB } from "../src/lib/db.js";
import Chat from "../src/modele/Chat.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '..', 'public');
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
} else {
  try {
    fs.mkdirSync(publicDir, { recursive: true });
    app.use(express.static(publicDir));
  } catch (err) {
    console.warn('Could not create public directory for static assets:', err.message);
  }
}

connectDB();

const storage = multer.memoryStorage();
const upload = multer({ storage });

const distDir = path.join(__dirname, '../dist');
const distIndex = path.join(distDir, 'index.html');
const publicIndex = path.join(publicDir, 'index.html');

if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));

  app.get('*', (req, res) => {
    if (fs.existsSync(distIndex)) {
      return res.sendFile(distIndex);
    }
    if (fs.existsSync(publicIndex)) {
      return res.sendFile(publicIndex);
    }
    return res.status(200).json(
      { 
        success: true, 
        message: 'Backend is running. Frontend build missing.' 
      }
    );
  });
} else {
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    if (fs.existsSync(publicIndex)) return res.sendFile(publicIndex);
    return res.status(200).json(
      { 
        success: true, 
        message: 'Backend is running. Frontend build not found.' 
      }
    );
  });
}

app.post("/api/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: "No file uploaded." });
  }

  try {

    const data = await pdf(req.file.buffer);

    const text = data.text;

    res.status(200).json({ success: true, text: text });
  } catch (error) {
    console.error("PDF Parse Error:", error);
    res.status(500).json({ success: false, error: "Failed to parse PDF." });
  }
});

app.post("/api/chat", async (req, res) => {
  const { history } = req.body;

  if (!history || history.length === 0) {
    return res.status(400).json({ error: "Chat history is required." });
  }

  try {
    const pdfPath = path.join(__dirname, '..', 'dist', 'uploade', '1757857495887-SHUBHAM PAL Resume canav.pdf');

    let localPdfText = '';
    try {
      if (fs.existsSync(pdfPath)) {
        const pdfBuffer = fs.readFileSync(pdfPath);
        const data = await pdf(pdfBuffer);
        localPdfText = data && data.text ? data.text : '';
      } else {
        console.warn(`Local PDF not found at ${pdfPath}. Continuing without resume text.`);
      }
    } catch (err) {
      console.error('Error loading local PDF:', err);
      localPdfText = '';
    }

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

  const MAX_REPLY_TOKENS = process.env.MAX_REPLY_TOKENS ? Number(process.env.MAX_REPLY_TOKENS) : 150;

    const contents = [
      {
        role: "user",
        parts: [
          {
            text: `You are an AI assistant representing Shubham Pal. 
                  Respond in first person as if you are his digital assistant — 
                  helpful, professional, and concise. 
                  Only answer questions related to this resume content: ${localPdfText}`,
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: "Understood. I will act as Shubham Pal's assistant and only answer questions based on the provided resume.",
          },
        ],
      },
      ...history,
    ];

    let result;
    try {
      result = await model.generateContent({ contents, maxOutputTokens: MAX_REPLY_TOKENS });
    } catch (err) {
      result = await model.generateContent({ contents });
    }
    let reply = await result.response.text();

    try {
      const words = reply.split(/\s+/);
      if (words.length > MAX_REPLY_TOKENS) {
        reply = words.slice(0, MAX_REPLY_TOKENS).join(' ') + '...';
      }
    } catch (err) {
      console.warn('Tokenization/truncation failed, returning full reply:', err && err.message);
    }

    const lastUserMessage = history[history.length - 1].parts[0].text;
    await Chat.create({ userMessage: lastUserMessage, botReply: reply });

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Chat API Error:", error);
    return res.status(500).json({ error: "Error processing chat", details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Backend is running." });
});


