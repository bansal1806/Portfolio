import { Router } from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const router = Router();
const FILES_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'files');

const FORMATS = {
  pdf: { ext: '.pdf', type: 'application/pdf' },
  docx: { ext: '.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
};

/** Finds the first CV file with the given extension in /files (e.g. Shourya_Bansal_CV.pdf). */
function findCv(ext) {
  const name = fs.readdirSync(FILES_DIR).find((f) => f.toLowerCase().endsWith(ext));
  return name ? path.join(FILES_DIR, name) : null;
}

// GET /api/cv  -> lists the available formats
router.get('/', (_req, res) => {
  res.json({
    success: true,
    formats: Object.keys(FORMATS).filter((f) => findCv(FORMATS[f].ext)).map((f) => ({ format: f, url: `/api/cv/${f}` })),
  });
});

// GET /api/cv/pdf | /api/cv/docx  -> streams the file as an attachment
router.get('/:format', (req, res, next) => {
  const format = FORMATS[req.params.format.toLowerCase()];
  if (!format) {
    return res.status(400).json({ success: false, message: 'Unsupported format. Use "pdf" or "docx".' });
  }
  const file = findCv(format.ext);
  if (!file) return res.status(404).json({ success: false, message: 'CV file not found on server.' });

  res.type(format.type);
  return res.download(file, path.basename(file), (err) => {
    if (err && !res.headersSent) next(err);
  });
});

export default router;
