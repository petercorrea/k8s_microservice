import 'dotenv/config';
import supertest from 'supertest';
import type TestAgent from 'supertest/lib/agent.js';
import { afterAll, beforeAll, test } from 'vitest';
import { app } from '../../index.js';
import { http_test_agent } from '../constants.js';

let request: TestAgent;

beforeAll(async () => {
  await app.ready();
  request = supertest.agent(app.server, http_test_agent);
});

test('access protected url without token', async () => {
  await request.get('/protected').expect(401);
});

test('access protected url with token', async () => {
  const TOKEN = app.jwt.sign({ user: 'test' }, { expiresIn: '1h' });

  await request
    .get('/protected')
    .set('Authorization', `Bearer ${TOKEN}`)
    .expect(200);
});

afterAll(async () => {
  await app.close();
});
