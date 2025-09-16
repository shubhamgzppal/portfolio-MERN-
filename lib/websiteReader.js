// lib/websiteReader.js
import fetch from 'node-fetch';
import cheerio from 'cheerio';

export async function extractTextFromWebsite(url) {
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);

  $('script, style, noscript').remove();

  const text = $('body').text();
  return text.replace(/\s+/g, ' ').trim();
}

