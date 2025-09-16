import request from 'supertest';
import app from '../../src/app';

describe('Health basics', () => {
  it('returns 404 for missing code', async () => {
    const res = await request(app).get('/nope-code-xyz');
    expect([302,404,410]).toContain(res.statusCode);
  });
});
