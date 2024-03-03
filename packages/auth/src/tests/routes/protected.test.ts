import 'dotenv/config';
import supertest from 'supertest';
import type TestAgent from 'supertest/lib/agent.js';
import { afterAll, beforeAll, test } from 'vitest';
import { http_test_agent } from '../../constants/constants.js';
import { app } from '../../index.js';

let request: TestAgent;

beforeAll(async () => {
  await app.ready();
  request = supertest.agent(app.server, http_test_agent);
});

test('access protected url without token', async () => {
  await request.get('/protected').expect(401);
});

afterAll(async () => {
  await app.close();
});
