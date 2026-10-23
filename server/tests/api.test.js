import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server-core';

import { createApp } from '../src/app.js';
import Message from '../src/models/Message.js';

process.env.NODE_ENV = 'test';
process.env.CLIENT_ORIGIN = 'http://localhost:5173';

let mongo;
let app;

before(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
  app = createApp();
});

after(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

describe('GET /api/health', () => {
  it('reports the API and database as up', async () => {
    const res = await request(app).get('/api/health').expect(200);
    assert.equal(res.body.status, 'ok');
    assert.equal(res.body.database, 'connected');
  });
});

describe('CV download routes', () => {
  it('lists both available formats', async () => {
    const res = await request(app).get('/api/cv').expect(200);
    assert.deepEqual(res.body.formats.map((f) => f.format), ['pdf', 'docx']);
  });

  it('serves the PDF as an attachment', async () => {
    const res = await request(app).get('/api/cv/pdf').expect(200);
    assert.equal(res.headers['content-type'], 'application/pdf');
    assert.match(res.headers['content-disposition'], /attachment; filename=.*\.pdf/);
    assert.equal(res.body.subarray(0, 4).toString(), '%PDF');
  });

  it('serves the DOCX as an attachment', async () => {
    const res = await request(app)
      .get('/api/cv/docx')
      .buffer(true)
      .parse((r, cb) => {
        const chunks = [];
        r.on('data', (c) => chunks.push(c));
        r.on('end', () => cb(null, Buffer.concat(chunks)));
      })
      .expect(200);
    assert.match(res.headers['content-type'], /wordprocessingml\.document/);
    assert.match(res.headers['content-disposition'], /\.docx/);
    assert.equal(res.body.subarray(0, 2).toString(), 'PK'); // .docx is a zip archive
  });

  it('rejects unknown formats', async () => {
    await request(app).get('/api/cv/xlsx').expect(400);
  });
});

describe('POST /api/contact', () => {
  const valid = { name: 'Ada Lovelace', email: 'ada@example.com', message: 'Hello! I would love to chat about a role.' };

  it('stores a valid message in MongoDB', async () => {
    const res = await request(app).post('/api/contact').send(valid).expect(201);
    assert.equal(res.body.success, true);
    const saved = await Message.findById(res.body.data.id);
    assert.equal(saved.email, valid.email);
    assert.equal(saved.read, false);
  });

  it('returns field errors for invalid input', async () => {
    const res = await request(app).post('/api/contact').send({ name: 'A', email: 'nope', message: 'hi' }).expect(400);
    assert.deepEqual(Object.keys(res.body.errors).sort(), ['email', 'message', 'name']);
  });

  it('silently drops honeypot submissions', async () => {
    const before = await Message.countDocuments();
    await request(app).post('/api/contact').send({ ...valid, website: 'http://spam.example' }).expect(201);
    assert.equal(await Message.countDocuments(), before);
  });

  it('rate limits repeated submissions', async () => {
    let last;
    for (let i = 0; i < 6; i += 1) last = await request(app).post('/api/contact').send(valid);
    assert.equal(last.status, 429);
  });
});

describe('GET /api/embed-check', () => {
  it('rejects sites that are not on the allowlist', async () => {
    await request(app).get('/api/embed-check').query({ url: 'https://example.com/', origin: 'https://portfolio.vercel.app' }).expect(400);
  });

  it('rejects malformed parameters', async () => {
    await request(app).get('/api/embed-check').query({ url: 'nope' }).expect(400);
  });
});

describe('Errors and CORS', () => {
  it('returns JSON 404 for unknown routes', async () => {
    const res = await request(app).get('/api/does-not-exist').expect(404);
    assert.equal(res.body.success, false);
  });

  it('allows same-origin requests when client and API share a domain', async () => {
    const res = await request(app)
      .get('/api/health')
      .set('Host', 'portfolio.vercel.app')
      .set('Origin', 'https://portfolio.vercel.app')
      .expect(200);
    assert.equal(res.headers['access-control-allow-origin'], 'https://portfolio.vercel.app');
  });

  it('allows requests the browser marks as same-origin (e.g. behind a proxy)', async () => {
    await request(app)
      .get('/api/health')
      .set('Origin', 'https://portfolio.vercel.app')
      .set('Sec-Fetch-Site', 'same-origin')
      .expect(200);
  });

  it('blocks requests from origins that are not whitelisted', async () => {
    await request(app).get('/api/health').set('Origin', 'https://evil.example').expect(403);
  });

  it('supports * wildcards in CLIENT_ORIGIN for per-deploy URLs', async () => {
    const saved = process.env.CLIENT_ORIGIN;
    process.env.CLIENT_ORIGIN = 'http://localhost:5173, https://portfolio-two-fawn*.vercel.app';
    const wild = createApp();
    process.env.CLIENT_ORIGIN = saved;

    for (const origin of ['https://portfolio-two-fawn.vercel.app', 'https://portfolio-two-fawn-0h72eb46it.vercel.app']) {
      const res = await request(wild).get('/api/health').set('Origin', origin).expect(200);
      assert.equal(res.headers['access-control-allow-origin'], origin);
    }
    // The wildcard never crosses a dot, and the rest of the origin must match exactly.
    await request(wild).get('/api/health').set('Origin', 'https://portfolio-two-fawn.evil.vercel.app').expect(403);
    await request(wild).get('/api/health').set('Origin', 'http://portfolio-two-fawn.vercel.app').expect(403);
    await request(wild).get('/api/health').set('Origin', 'https://portfolio-two-fawnXvercel.app').expect(403);
  });

  it('forgives quotes, spaces and trailing slashes in CLIENT_ORIGIN', async () => {
    const saved = process.env.CLIENT_ORIGIN;
    process.env.CLIENT_ORIGIN = ' "https://portfolio-two-fawn.vercel.app/" , https://other.example// ';
    const loose = createApp();
    process.env.CLIENT_ORIGIN = saved;
    await request(loose).get('/api/health').set('Origin', 'https://portfolio-two-fawn.vercel.app').expect(200);
    await request(loose).get('/api/health').set('Origin', 'https://other.example').expect(200);
  });
});
