import fetch from "node-fetch";
import * as cheerio from "cheerio";

/**
 * Extract visible text from a static Next.js website.
 * Netlify-compatible (no puppeteer).
 * @param {string} url
 * @returns {Promise<string>}
 */
export async function extractTextFromWebsite(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; Bot/1.0)",
    },
  });

  if (!res.ok) throw new Error(`Failed to fetch website: ${res.statusText}`);

  const html = await res.text();
  const $ = cheerio.load(html);
  const bodyText = $("body").text().replace(/\s+/g, " ").trim();

  return bodyText;
}
