// Generates the downloadable CV in PDF and DOCX formats from resume-data.js.
// Usage: npm run generate:cv
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import PDFDocument from 'pdfkit';
import {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, TabStopType,
} from 'docx';
import cv from './resume-data.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'files');
const baseName = cv.name.replace(/\s+/g, '_') + '_CV';
fs.mkdirSync(outDir, { recursive: true });

const ACCENT = '#6d28d9';
const contactLine = Object.values(cv.contact).join('  ·  ');

/* ---------------------------------- PDF ---------------------------------- */
function buildPdf() {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50, info: { Title: `${cv.name} — CV`, Author: cv.name } });
    const file = path.join(outDir, `${baseName}.pdf`);
    const stream = fs.createWriteStream(file);
    doc.pipe(stream);

    const width = doc.page.width - 100;
    const heading = (text) => {
      doc.moveDown(0.8).font('Helvetica-Bold').fontSize(12).fillColor(ACCENT).text(text.toUpperCase());
      const y = doc.y + 2;
      doc.moveTo(50, y).lineTo(50 + width, y).lineWidth(0.8).strokeColor(ACCENT).stroke();
      doc.moveDown(0.5).fillColor('#111');
    };
    const row = (left, right) => {
      const y = doc.y;
      doc.font('Helvetica-Bold').fontSize(10.5).text(left, 50, y, { width: width - 130 });
      const afterLeft = doc.y;
      doc.font('Helvetica').fontSize(9.5).fillColor('#555').text(right, 50 + width - 130, y, { width: 130, align: 'right' });
      doc.fillColor('#111').y = Math.max(afterLeft, doc.y);
      doc.x = 50;
    };

    doc.font('Helvetica-Bold').fontSize(24).fillColor('#111').text(cv.name, { align: 'center' });
    doc.font('Helvetica').fontSize(12).fillColor(ACCENT).text(cv.title, { align: 'center' });
    doc.moveDown(0.3).fontSize(9).fillColor('#555').text(contactLine, { align: 'center' });
    doc.fillColor('#111');

    heading('Profile');
    doc.font('Helvetica').fontSize(10).text(cv.summary, { align: 'justify' });

    heading('Technical Skills');
    cv.skills.forEach(([k, v]) => {
      doc.font('Helvetica-Bold').fontSize(10).text(`${k}: `, { continued: true }).font('Helvetica').text(v);
    });

    heading('Experience');
    cv.experience.forEach((e) => {
      row(`${e.role} — ${e.org}`, e.period);
      doc.font('Helvetica').fontSize(10).list(e.points, { bulletRadius: 1.5, textIndent: 10, indent: 6 });
      doc.moveDown(0.3);
    });

    heading('Projects');
    cv.projects.forEach((p) => {
      doc.font('Helvetica-Bold').fontSize(10.5).text(p.name, { continued: true })
        .font('Helvetica-Oblique').fontSize(9.5).fillColor('#555').text(`   ${p.stack}`);
      doc.fillColor('#111').font('Helvetica').fontSize(10).text(p.desc);
      doc.moveDown(0.3);
    });

    heading('Education');
    cv.education.forEach((e) => {
      row(e.degree, e.period);
      doc.font('Helvetica').fontSize(10).text([e.org, e.note].filter(Boolean).join('  •  '));
      doc.moveDown(0.3);
    });

    heading('Certifications');
    doc.font('Helvetica').fontSize(10).list(cv.certifications, { bulletRadius: 1.5, textIndent: 10, indent: 6 });

    doc.end();
    stream.on('finish', () => resolve(file));
    stream.on('error', reject);
  });
}

/* ---------------------------------- DOCX --------------------------------- */
async function buildDocx() {
  const accent = ACCENT.slice(1);
  const RIGHT_TAB = 9360; // twips: right edge of a Letter/A4 page with 1" margins

  const heading = (text) =>
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 240, after: 100 },
      border: { bottom: { color: accent, style: BorderStyle.SINGLE, size: 6, space: 2 } },
      children: [new TextRun({ text: text.toUpperCase(), bold: true, color: accent, size: 24 })],
    });
  const row = (left, right) =>
    new Paragraph({
      tabStops: [{ type: TabStopType.RIGHT, position: RIGHT_TAB }],
      children: [new TextRun({ text: left, bold: true }), new TextRun({ text: `\t${right}`, color: '555555' })],
    });
  const bullet = (text) => new Paragraph({ text, bullet: { level: 0 } });
  const para = (text) => new Paragraph({ children: [new TextRun(text)], spacing: { after: 80 } });

  const doc = new Document({
    creator: cv.name,
    title: `${cv.name} — CV`,
    styles: { default: { document: { run: { font: 'Calibri', size: 21 } } } },
    sections: [
      {
        children: [
          new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: cv.name, bold: true, size: 48 })] }),
          new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: cv.title, color: accent, size: 26 })] }),
          new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: contactLine, color: '555555', size: 18 })] }),

          heading('Profile'),
          para(cv.summary),

          heading('Technical Skills'),
          ...cv.skills.map(([k, v]) => new Paragraph({ children: [new TextRun({ text: `${k}: `, bold: true }), new TextRun(v)] })),

          heading('Experience'),
          ...cv.experience.flatMap((e) => [row(`${e.role} — ${e.org}`, e.period), ...e.points.map(bullet)]),

          heading('Projects'),
          ...cv.projects.flatMap((p) => [
            new Paragraph({
              children: [new TextRun({ text: p.name, bold: true }), new TextRun({ text: `   ${p.stack}`, italics: true, color: '555555' })],
            }),
            para(p.desc),
          ]),

          heading('Education'),
          ...cv.education.flatMap((e) => [row(e.degree, e.period), para([e.org, e.note].filter(Boolean).join('  •  '))]),

          heading('Certifications'),
          ...cv.certifications.map(bullet),
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
