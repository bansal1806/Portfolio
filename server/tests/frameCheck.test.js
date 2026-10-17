import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { canEmbed } from '../src/utils/frameCheck.js';

const ME = 'https://portfolio.vercel.app';
const SITE = 'https://www.hackjklu.com';

describe('canEmbed', () => {
  it('allows sites that send no framing headers', () => {
    assert.equal(canEmbed({}, ME, SITE), true);
  });

  it('blocks X-Frame-Options DENY and cross-origin SAMEORIGIN', () => {
    assert.equal(canEmbed({ xFrameOptions: 'DENY' }, ME, SITE), false);
    assert.equal(canEmbed({ xFrameOptions: 'SAMEORIGIN' }, ME, SITE), false);
  });

  it('allows an embedder listed in frame-ancestors, even with X-Frame-Options DENY', () => {
    const csp = "default-src 'self'; frame-ancestors 'self' https://portfolio.vercel.app";
    assert.equal(canEmbed({ xFrameOptions: 'DENY', csp }, ME, SITE), true);
  });

  it('blocks embedders that frame-ancestors does not list', () => {
    assert.equal(canEmbed({ csp: "frame-ancestors 'self'" }, ME, SITE), false);
    assert.equal(canEmbed({ csp: "frame-ancestors 'none'" }, ME, SITE), false);
    assert.equal(canEmbed({ csp: 'frame-ancestors https://other.vercel.app' }, ME, SITE), false);
  });

  it('supports wildcard hosts, schemes and ports', () => {
    assert.equal(canEmbed({ csp: 'frame-ancestors https://*.vercel.app' }, ME, SITE), true);
    assert.equal(canEmbed({ csp: 'frame-ancestors https:' }, ME, SITE), true);
    assert.equal(canEmbed({ csp: 'frame-ancestors http://localhost:5173' }, 'http://localhost:5173', SITE), true);
    assert.equal(canEmbed({ csp: 'frame-ancestors http://localhost:5173' }, 'http://localhost:3000', SITE), false);
  });
});
