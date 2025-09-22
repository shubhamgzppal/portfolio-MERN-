import puppeteer from "puppeteer";

let browserInstance = null;

async function getBrowser() {
  if (browserInstance) return browserInstance;

  browserInstance = await puppeteer.launch({
    headless: "new", // Use "new" for newer versions, or true for compatibility
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  // Graceful shutdown
  process.on("exit", async () => {
    if (browserInstance) await browserInstance.close();
  });

  return browserInstance;
}

// In-memory cache
const websiteCache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Extract visible text from a JavaScript-rendered website with caching.
 * @param {string} url
 * @returns {Promise<string>}
 */
export async function extractTextFromWebsite(url) {
  const now = Date.now();

  // --- Serve from cache if fresh ---
  const cached = websiteCache.get(url);
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return cached.text;
  }

  const browser = await getBrowser();
  const page = await browser.newPage();

  try {
    // Block unnecessary resources (images, fonts, etc.)
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      const type = req.resourceType();
      if (["image", "stylesheet", "font", "media"].includes(type)) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 15000,
    });

    // Extract only visible text
    const text = await page.evaluate(() => document.body.innerText);
    const cleanedText = text.replace(/\s+/g, " ").trim();

    // Cache result
    websiteCache.set(url, { text: cleanedText, timestamp: now });

    return cleanedText;
  } catch (err) {
    console.error("❌ Website extraction error:", err.message);
    throw err;
  } finally {
    await page.close();
  }
}