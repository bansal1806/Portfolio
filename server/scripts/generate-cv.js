// Builds the downloadable CV served by GET /api/cv/:format.
//   PDF  — the HTML CV (client/public/cv/index.html) printed by headless Chrome, so the
//          download looks exactly like the online version.
//   DOCX — an editable Word version generated from resume-data.js.
// Usage: npm run generate:cv   (set CHROME_PATH if Chrome/Edge isn't found automatically)
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer-core';
import {
  Document, Packer, Paragraph, TextRun, ExternalHyperlink, AlignmentType, BorderStyle, TabStopType,
} from 'docx';
import cv from './resume-data.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'files');
const htmlCv = path.join(__dirname, '..', '..', 'client', 'public', 'cv', 'index.html');
const baseName = cv.name.replace(/\s+/g, '_') + '_CV';
fs.mkdirSync(outDir, { recursive: true });

/* ---------------------------------- PDF ---------------------------------- */
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
    '/usr/bin/chromium-browser',
  ];
  // Chrome downloaded by Puppeteer elsewhere on this machine (~/.cache/puppeteer/chrome/<ver>/...)
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

async function buildPdf() {
  const browser = await puppeteer.launch({ executablePath: findChrome() });
  try {
    const page = await browser.newPage();
    await page.goto(pathToFileURL(htmlCv).href, { waitUntil: 'networkidle0' });
    await page.evaluateHandle('document.fonts.ready');
    const file = path.join(outDir, `${baseName}.pdf`);
    // Page size and margins come from the CV's own @page / @media print rules.
    await page.pdf({ path: file, preferCSSPageSize: true, printBackground: true });
    return file;
  } finally {
    await browser.close();
  }
}

/* ---------------------------------- DOCX --------------------------------- */
async function buildDocx() {
  const RIGHT_TAB = 9638; // twips: right edge of an A4 page with 2cm margins
  const GREY = '777777';

  const heading = (text) =>
    new Paragraph({
      spacing: { before: 260, after: 100 },
      border: { bottom: { color: 'DDDDDD', style: BorderStyle.SINGLE, size: 6, space: 2 } },
      children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 24, font: 'Cormorant Garamond', characterSpacing: 60 })],
    });
  const row = (runs, right) =>
    new Paragraph({
      spacing: { before: 100 },
      tabStops: [{ type: TabStopType.RIGHT, position: RIGHT_TAB }],
      children: [...runs, new TextRun({ text: `\t${right}`, color: GREY, size: 18 })],
    });
  const desc = (text) => new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text, color: '444444' })] });

  const contactRuns = cv.contact.flatMap((c, i) => [
    ...(i ? [new TextRun({ text: '  ◆  ', color: 'BBBBBB', size: 14 })] : []),
    new ExternalHyperlink({ link: c.url, children: [new TextRun({ text: c.label, color: '333333', size: 19 })] }),
  ]);

  const doc = new Document({
    creator: cv.name,
    title: `${cv.name} — CV`,
    styles: { default: { document: { run: { font: 'Inter', size: 20 } } } },
    sections: [
      {
        properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 850, bottom: 850, left: 1134, right: 1134 } } },
        children: [
          new Paragraph({ children: [new TextRun({ text: cv.name, bold: true, size: 64, font: 'Cormorant Garamond' })] }),
          new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: cv.title.toUpperCase(), color: '555555', size: 21, characterSpacing: 80 })] }),
          new Paragraph({ border: { bottom: { color: '000000', style: BorderStyle.SINGLE, size: 6, space: 6 } }, children: contactRuns }),

          heading('Profile'),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            border: { left: { color: '000000', style: BorderStyle.SINGLE, size: 18, space: 8 } },
            children: [new TextRun({ text: cv.summary, color: '2A2A2A' })],
          }),

          heading('Experience'),
          ...cv.experience.flatMap((e) => [
            row([new TextRun({ text: e.role, bold: true }), new TextRun({ text: ` @ ${e.org}`, italics: true, color: '888888' })], e.period),
            desc(e.desc),
          ]),

          heading('Projects'),
          ...cv.projects.flatMap((p) => [row([new TextRun({ text: p.name, bold: true })], p.period), desc(p.desc)]),

          heading('Education'),
          ...cv.education.flatMap((e) => [
            row([new TextRun({ text: e.degree, bold: true })], e.period),
            new Paragraph({ children: [new TextRun({ text: e.org, italics: true, color: '555555' })] }),
          ]),

          heading('Skills'),
          ...cv.skills.map(([label, tags]) =>
            new Paragraph({
              spacing: { after: 40 },
              children: [new TextRun({ text: `${label}: `, bold: true }), new TextRun({ text: tags, color: '555555' })],
            })
          ),

          heading('Achievements'),
          ...cv.achievements.map(([text, date]) =>
            new Paragraph({
              bullet: { level: 0 },
              children: [new TextRun({ text, color: '333333' }), ...(date ? [new TextRun({ text: `  ${date}`, color: '999999', size: 18 })] : [])],
            })
          ),
        ],
      },
    ],
  });

  const file = path.join(outDir, `${baseName}.docx`);
  fs.writeFileSync(file, await Packer.toBuffer(doc));
  return file;
}

const files = await Promise.all([buildPdf(), buildDocx()]);
files.forEach((f) => console.log('✔ generated', path.relative(process.cwd(), f)));
