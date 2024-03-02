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

test('google login url', async () => {
  await request.get('/login/google').expect(302);
});

afterAll(async () => {
  await app.close();
});
