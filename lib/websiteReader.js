import fetch from "node-fetch";
import * as cheerio from "cheerio";

/**
 * Extract visible text content from a website (ignores scripts/styles).
 * @param {string} url - Website URL
 * @returns {Promise<string>}
 */
export async function extractTextFromWebsite(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch website: ${res.status} ${res.statusText}`);
  }

  const html = await res.text();
  const $ = cheerio.load(html);

  // Remove noise
  $("script, style, noscript, iframe").remove();

  // Extract visible text
  const text = $("body").text();
  return text.replace(/\s+/g, " ").trim();
}
