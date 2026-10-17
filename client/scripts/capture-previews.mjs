// Captures a full-page screenshot of every project's live site for the project cards.
// Most of the sites send X-Frame-Options: DENY, so they can't be embedded as live iframes;
// a scrolling screenshot is the closest thing that works for every site.
//
// Usage (from /client):  npm run capture:previews            → all projects
//                        npm run capture:previews -- nexide  → only the given slugs
// Needs Chrome or Edge installed (or set CHROME_PATH).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import { projects } from '../src/data/portfolio.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'public', 'previews');
const VIEWPORT = { width: 1440, height: 900 };
const MAX_HEIGHT = 5400; // px of page captured (6 screens) — keeps files small
const OUTPUT_WIDTH = 720; // stored at half size: crisp at card size, ~100–300 KB each

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
  ];
  const cache = path.join(os.homedir(), '.cache', 'puppeteer', 'chrome');
  if (fs.existsSync(cache)) {
    for (const ver of fs.readdirSync(cache).sort().reverse()) {
      candidates.push(path.join(cache, ver, 'chrome-win64', 'chrome.exe'), path.join(cache, ver, 'chrome-linux64', 'chrome'));
    }
  }
  const found = candidates.find((p) => p && fs.existsSync(p));
  if (!found) throw new Error('Chrome/Edge not found — set CHROME_PATH to a Chromium-based browser executable.');
  return found;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Extra settle time (ms) for sites that stream data in after load.
const EXTRA_WAIT = { dhund: 6000, hackjklu: 4000 };
// Scroll-driven sites render their content only while scrolling — capture just the first screen.
const FIRST_SCREEN_ONLY = new Set(['hackjklu']);

/** Clicks an intro "Skip" button if the site shows one (e.g. HackJKLU's cinematic intro). */
async function skipIntro(page) {
  const clicked = await page.evaluate(() => {
    const btn = [...document.querySelectorAll('button, a, [role="button"]')].find((el) =>
      /^\s*skip( intro)?\s*$/i.test(el.textContent || '')
    );
    btn?.click();
    return Boolean(btn);
  });
  if (clicked) await sleep(3000);
}

async function capture(browser, project) {
  const page = await browser.newPage();
  try {
    await page.setViewport(VIEWPORT);
    await page.goto(project.live, { waitUntil: 'networkidle2', timeout: 60000 });
    await sleep(2500);
    await skipIntro(page);
    await sleep(EXTRA_WAIT[project.slug] ?? 0);

    // Scroll through the page so lazy-loaded images and scroll animations render.
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < Math.min(total, MAX_HEIGHT); y += 450) {
      await page.evaluate((top) => window.scrollTo(0, top), y);
      await sleep(250);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.keyboard.press('Escape'); // dismiss newsletter/cookie popups that listen for Esc
    await sleep(3000); // let entrance animations at the top of the page finish

    const height = FIRST_SCREEN_ONLY.has(project.slug)
      ? VIEWPORT.height
      : Math.min(await page.evaluate(() => document.documentElement.scrollHeight), MAX_HEIGHT);
    const png = await page.screenshot({
      encoding: 'base64',
      clip: { x: 0, y: 0, width: VIEWPORT.width, height: Math.max(height, VIEWPORT.height) },
      captureBeyondViewport: true,
    });

    // Downscale and encode as WebP inside the browser (no image library needed).
    const webp = await page.evaluate(async (src, width) => {
      const img = new Image();
      img.src = src;
      await img.decode();
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = Math.round((img.height * width) / img.width);
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/webp', 0.78).split(',')[1];
    }, `data:image/png;base64,${png}`, OUTPUT_WIDTH);

    const file = path.join(OUT_DIR, `${project.slug}.webp`);
    fs.writeFileSync(file, Buffer.from(webp, 'base64'));
    console.log(`✔ ${project.slug.padEnd(18)} ${Math.round(fs.statSync(file).size / 1024)} KB`);
  } finally {
    await page.close();
  }
}

const only = process.argv.slice(2);
const targets = projects.filter((p) => p.live && (!only.length || only.includes(p.slug)));
fs.mkdirSync(OUT_DIR, { recursive: true });

const browser = await puppeteer.launch({ executablePath: findChrome() });
let failed = 0;
for (const project of targets) {
  try {
    await capture(browser, project);
  } catch (err) {
    failed += 1;
    console.error(`✖ ${project.slug}: ${err.message}`);
  }
}
await browser.close();
process.exit(failed ? 1 : 0);
